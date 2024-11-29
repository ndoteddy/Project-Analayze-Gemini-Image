# Google Cloud Run Deployment: Analyze Image with Gemini

This guide walks you through setting up and deploying the image analysis app using Google Cloud Run, Docker, and a service account for authentication. Follow these steps to authenticate, build, push Docker images, assign IAM roles, and deploy your app.

---

## Table of Contents
[Prerequisites](#prerequisites)
[Step 1: Authenticate with Google Cloud](#step-1-authenticate-with-google-cloud)
[Step 2: Create and Assign Roles to Service Account](#step-2-create-and-assign-roles-to-service-account)
[Step 3: Verify Active Service Account](#step-3-verify-active-service-account)
[Step 4: Create and Manage Service Account Keys](#step-4-create-and-manage-service-account-keys)
[Step 5: Build and Push Docker Image](#step-5-build-and-push-docker-image)
[Step 6 Deploy the Docker Image to Google Cloud Run](#step-6-deploy-the-docker-image-to-google-cloud-run)
[Troubleshooting & Notes](#troubleshooting--notes)
[Conclusion](#conclusion)

---

##  Prerequisites

Before you begin, ensure that you have the following:
- **Google Cloud SDK** installed
- **Docker** installed
- **Google Cloud Project** created and set up
- **Service account** with necessary permissions
- **Docker image** ready for deployment

---

##  Step 1: Authenticate with Google Cloud

Authenticate using a service account or your Google Cloud account. This ensures you have the necessary permissions to interact with Google Cloud services.

### Authenticate with Service Account
gcloud auth activate-service-account --key-file=../scKey/<yourkey>.json
gcloud auth configure-docker

## Step 2:  Create and Assign Roles to Service Account
gcloud iam service-accounts create cloud-run-app-sa \
  --description="Service account for Cloud Run app" \
  --display-name="Cloud Run App Service Account"

  Assign IAM via the UI or Cli 
  sample : 
  gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" \
  --role="roles/run.invoker"

we need IAM for 
  --role="roles/run.invoker"
  --role="roles/storage.objectViewer"
 --role="roles/artifactregistry.writer"
   --role="roles/datastore.user"

## Step 3: Verify Active Service Account
gcloud auth list
export GOOGLE_APPLICATION_CREDENTIALS="../scKey/<<your-service-acc-key>>.json"
gcloud auth activate-service-account --key-file ../scKey/stellar-horizon-nando.json
gcloud auth configure-docker
## Step 4: Create and Manage Service Account Keys
You can generate via IAM - Service account and download to your local
or using this way

gcloud iam service-accounts keys create ../scKey/<<your-service-acc-key>>.json \
  --iam-account cloud-run-app-sa@your-project-name.iam.gserviceaccount.com

export GOOGLE_APPLICATION_CREDENTIALS="../scKey/stellar-horizon-nando-v1.json"

## Step 5: Build and Push Docker Image
docker build -t analyze-image-with-gemini-docker-v3 .

docker tag analyze-image-with-gemini-docker-v3 gcr.io/stellar-horizon-438503-s6/analyze-image-with-gemini-docker:v3

docker push  gcr.io/stellar-horizon-438503-s6/analyze-image-with-gemini-docker:v3


## Step 6: Deploy the Docker Image to Google Cloud Run
ENV_VARS=$(grep -v '^#' .env | xargs -I {} echo -n "{}," | sed 's/,$//')
(export the env to variable and inject during provisioning)
gcloud run deploy gdg-dev-analyze-image-cloud-run \
  --image gcr.io/your-project-name/analyze-image-with-gemini-docker:v2 \
  --set-env-vars $ENV_VARS \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated

## Troubleshooting & Notes
- just create issue we will check

## Conclusion
- hope this poc will help you integrate with AI as friendly as possible
- if you found this poc help you to build your mega application or next unicorn
- just put in comment section or add my name as your reference- i would be more than happy to give back to society
- terima kasih - by nando teddy 


