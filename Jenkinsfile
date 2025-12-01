pipeline {
    agent any

    stages {
        stage('Test') {
          steps {
            echo "Hello from Jenkins"
            sh 'node -v'
            sh 'npm -v'
            sh 'docker -v'
          }
        }
    }


    stages {
        stage('Git Clone') {
            steps {
                echo "Git Clone"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm packages..."
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                echo "Building React app..."
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t solcation-fe:latest ."
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Stopping existing container (if any)..."
                sh "docker rm -f solcation-fe || true"

                echo "Running new container..."
                sh "docker run -d -p 80:80 --name solcation-fe solcation-fe:latest"
            }
        }
    }

    post {
        success {
            echo "React build and Docker deployment completed successfully!"
        }
        failure {
            echo "Build or deployment failed!"
        }
    }
}
