@Library('jenkins-shared-library') _

pipeline {
    agent any

    environment {
        FRONTEND_BASE_URL = credentials('frontend_url')
        API_BASE_URL      = credentials('api_url')
        REPORTER          = credentials('reporter')
        ADMIN_EMAIL       = credentials('admin_email')
        ADMIN_PASSWORD    = credentials('admin_password')
        PARTNER_EMAIL     = credentials('partner_email')
        PARTNER_PASSWORD  = credentials('partner_password')
        PW_RETRIES        = credentials('pw_retries')
        PW_WORKERS        = credentials('pw_workers')
    }

    stages {

        stage('Checkout') {
            steps {
                checkoutCode('https://github.com/girishsuthar229/nestassist-automation.git')
            }
        }

        stage('Install') {
            steps {
                installDependencies()
            }
        }

        stage('Test') {
            steps {
                script {
                    withEnv([
                        "FRONTEND_BASE_URL=${env.FRONTEND_BASE_URL}",
                        "API_BASE_URL=${env.API_BASE_URL}",
                        "ADMIN_EMAIL=${env.ADMIN_EMAIL}",
                        "ADMIN_PASSWORD=${env.ADMIN_PASSWORD}",
                        "PARTNER_EMAIL=${env.PARTNER_EMAIL}",
                        "PARTNER_PASSWORD=${env.PARTNER_PASSWORD}",
                        "PW_RETRIES=${env.PW_RETRIES}",
                        "PW_WORKERS=${env.PW_WORKERS}",
                        "REPORTER=${env.REPORTER}"
                    ]) {
                        runPlaywrightTests()
                    }
                }
            }
        }

        stage('Publish Report') {
            steps {
                publishAllureReport()
            }
        }
    }
}