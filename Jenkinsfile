pipeline {
    agent any

    environment {
        // Define your Docker image name and registry
        IMAGE_NAME = "coordinate-checker"
        DOCKER_REGISTRY = "registry.example.com"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        // Get the credentials ID you set up in Jenkins
        ENV_CREDENTIALS_ID = "coordinate-checker-env" 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                // Fetch the secret file from Jenkins Credentials and copy it to .env
                withCredentials([file(credentialsId: env.ENV_CREDENTIALS_ID, variable: 'SECRET_ENV')]) {
                    sh 'cp $SECRET_ENV .env'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // We extract the API key from the .env file to pass as a build arg
                    // because Vite requires VITE_ prefixed env vars AT BUILD TIME.
                    def apiKey = sh(script: "grep VITE_GOOGLE_MAPS_API_KEY .env | cut -d '=' -f2 | tr -d '\"'", returnStdout: true).trim()
                    
                    // Build the image using shell instead of Jenkins 'docker' plugin var
                    sh "docker build --build-arg VITE_GOOGLE_MAPS_API_KEY=${apiKey} -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    
                    // Tag as latest as well
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy / Run Container') {
            steps {
                script {
                    // Stop & remove existing container if it exists
                    sh "docker stop ${IMAGE_NAME} || true"
                    sh "docker rm ${IMAGE_NAME} || true"

                    // Run the newly built container
                    // Exposing container internal port 3000 to external host port 3010
                    sh """
                        docker run -d \
                        --name ${IMAGE_NAME} \
                        -p 3010:3000 \
                        --restart always \
                        --env-file .env \
                        ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Clean up the .env file so it does not persist in the Jenkins workspace
            sh 'rm -f .env'
            cleanWs()
        }
    }
}
