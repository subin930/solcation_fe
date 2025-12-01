pipeline {
    agent any

    environment {
        NODE_HOME = '/usr/local/bin/node'
        PATH = "${env.NODE_HOME}:${env.PATH}"
    }

    stages {
        stage('Git Clone') {
            steps {
                checkout scm
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
                sh "docker build -t solcation-fe:latest ."
            }
        }

        stage('Run Docker Container') {
            steps {
                // 기존 컨테이너 있으면 제거
                sh "docker rm -f solcation-fe || true"
                // 새 컨테이너 실행 (EC2 퍼블릭 포트 80 -> 컨테이너 80)
                sh "docker run -d -p 80:80 --name solcation-fe solcation-fe:latest"
            }
        }
    }

    post {
        success {
            echo "React build completed successfully!"
        }
        failure {
            echo "React build failed!"
        }
    }
}
