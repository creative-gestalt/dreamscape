/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Deploy") {
	container("Start Deployment", image = "gradle:6.1.1-jre11") {
		kotlinScript { api ->
			// create and start deployment
            api.space().projects.automation.deployments.start(
                project = api.projectIdentifier(),
                targetIdentifier = TargetIdentifier.Key("production-image"),
                version = "1.0." + System.getenv("JB_SPACE_EXECUTION_NUMBER"),
                // sync the job and deployment states
                syncWithAutomationJob = true
            )
        }
    }

    host("Build a Docker image") {
        // generate artifacts required for the image
        // assign project secrets to environment variables
        env["HUB_USER"] = Secrets("dockerhub_user")
        env["HUB_TOKEN"] = Secrets("dockerhub_token")
        // login to docker
        shellScript {
            content = """
                docker login --username ${'$'}HUB_USER --password "${'$'}HUB_TOKEN"
            """
          }

        dockerBuildPush {
            labels["vendor"] = "creativegestalt"

            val dockerHub = "creativegestalt/dreamscape"
            // image tags for 'docker push'
            tags {
                +"$dockerHub:1.0.${"$"}JB_SPACE_EXECUTION_NUMBER"
                +"$dockerHub:latest"
            }
        }
    }

    container("Finish Deployment", image = "gradle:6.1.1-jre11") {
		kotlinScript { api ->
            api.space().projects.automation.deployments.finish(
                project = api.projectIdentifier(),
                targetIdentifier = TargetIdentifier.Key("production-image"),
                version = "1.0." + System.getenv("JB_SPACE_EXECUTION_NUMBER")
            )
        }
    }
}

