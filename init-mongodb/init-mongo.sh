set -e

mongo <<EOF
db = db.getSiblingDB("$DB_NAME")

db.createUser({
    user: "$DB_USER",
    pwd: "$DB_PWD",
    roles: [
        {
            role: "readWrite",
            db: "$DB_NAME"
        }
    ]
})

db.createCollection("dreams", { capped: false })
db.createCollection("sessions", { capped: false })
db.createCollection("settings", { capped: false })

EOF