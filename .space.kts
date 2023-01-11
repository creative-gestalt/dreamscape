/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Build and push Docker") {
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
}
