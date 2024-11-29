gcloud auth activate-service-account --key-file ../scKey/stellar-horizon-nando.json
  gcloud auth configure-docker
docker build -t analyze-image-with-gemini-docker-v2 .

docker tag analyze-image-with-gemini-docker-v2 gcr.io/your-project-name/analyze-image-with-gemini-docker:v2
docker push  gcr.io/your-project-name/analyze-image-with-gemini-docker:v2

docker run -p 8080:8080 analyze-image-with-gemini-docker

google


gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
docker tag my-cloud-run-app gcr.io/[YOUR_PROJECT_ID]/my-cloud-run-app
docker push gcr.io/[YOUR_PROJECT_ID]/my-cloud-run-app

create service accountS
gcloud iam service-accounts create  cloud-run-app-sa \
  --description="Service account for Cloud Run app - GDG Dev Fest 2024" \
  --display-name="Cloud Run App Service Account"

  assign iam role to access other cloud resources (e.g cloud storage,registry,sql)

assign service account to the project

- this one take time after provision usually few minutes
then only can assign iam to service account

--> for invoke other cloud run rservice 
gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" \
  --role="roles/run.invoker"

--> cloud storage
gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" \
  --role="roles/storage.objectViewer" 

--> artifact regsistry
gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" \
  --role="roles/artifactregistry.writer" 

  --> firestore

  gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:cloud-run-firestore-sa@[YOUR_PROJECT_ID].iam.gserviceaccount.com" \
  --role="roles/datastore.user"

  --> cloud sql access

  gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" \
  --role="roles/cloudsql.client"


--> list iam role for verification
gcloud iam service-accounts get-iam-policy [SERVICE_ACCOUNT_EMAIL] --project=[YOUR_PROJECT_ID]


-- verify the cloud run sa (service account) roles under this project 
gcloud projects get-iam-policy your-project-name | grep -A 1 cloud-run-app-sa


ok since we until this stage
we have 2 knowledge need to remember
1. normal account (right now we login using normal)
2. service account - since this will be usefull for our pipeline/automation - preferrable
u need gto generrate service account key 


-- create key from existing service account
gcloud iam service-accounts keys create ../scKey/<<your-service-acc-key>>.json \
    --iam-account cloud-run-app-sa@your-project-name.iam.gserviceaccount.com

permission it will automatically putthis file under super restricted permission 
either u can adjust it using chmod or other up to you


-- now we are going to use service account for our cli

gcloud auth activate-service-account --key-file=./scKey/<<your-service-acc-key>>.json 
update docker with our gcloud
gcloud auth configure-docker



u can do this  role bindingfrom root account not service acocunt bear in mind add this when u are in the administrator mode

gcloud projects add-iam-policy-binding [PROJECT-ID] \
    --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" \
    --role="roles/storage.admin"

--docker image
gcr.io/your-project-name/analyze-image-with-gemini-docker:v1

--this to allow service account can do listing and deploy
gcloud projects add-iam-policy-binding your-project-name \
  --member="serviceAccount:cloud-run-app-sa@your-project-name.iam.gserviceaccount.com" \
  --role="roles/run.admin"


run google cloud
ENV_VARS=$(grep -v '^#' .env | xargs -I {} echo -n "{}," | sed 's/,$//')

--execute this to provision serverless
gcloud run deploy gdg-dev-analyze-image-cloud-run \
  --image gcr.io/your-project-name/analyze-image-with-gemini-docker:v1 \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated

  gcloud run deploy gdg-dev-analyze-image-cloud-run   --image gcr.io/stellar-horizon-438503-s6/analyze-image-with-gemini-docker:v3  --set-env-vars $ENV_VARS   --platform managed   --region asia-east1   --allow-unauthenticated

  gcloud iam service-accounts add-iam-policy-binding 415493226777-compute@developer.gserviceaccount.com \
  --member="serviceAccount:cloud-run-app-sa@your-project-name.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

  beware about service account check which one active at one session 
  gcloud auth list

  if not the one that ewe expect just change


  export GOOGLE_APPLICATION_CREDENTIALS="../scKey/<<your-service-acc-key>>.json"
  gcloud auth activate-service-account --key-file ../scKey/stellar-horizon-nando.json
  gcloud auth configure-docker


  









