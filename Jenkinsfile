@Library('jenkins-shared-library') _

pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkoutCode('https://github.com/girishsuthar229/automation-with-playwright.git')
            }
        }

        stage('Install') {
            steps {
                installDependencies()
            }
        }

        stage('Test') {
            steps {
                runPlaywrightTests()
            }
        }

        stage('Publish Report') {
            steps {
                publishReport()
            }
        }
    }
}