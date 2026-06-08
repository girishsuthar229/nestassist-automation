@Library('playwright-shared-library') _

pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkoutCode(
                    'https://github.com/company/playwright-demo.git'
                )
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