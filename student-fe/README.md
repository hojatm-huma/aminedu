## Quick start

- Recommended: `Node.js v20.x`
- **Install:** `npm i` or `yarn install`
- **Start:** `npm run dev` or `yarn dev`
- **Build:** `npm run build` or `yarn build`
- **Set S3 CORS**: `s3cmd setcors cors.xml s3://student-fe`
- **Upload to S3**: `aws --endpoint-url https://s3.ir-thr-at1.arvanstorage.ir s3 sync build/ s3://tam-front-production --acl public-read`
- **Upload to s3 using s3cmd**: `s3cmd put --recursive --acl-public --no-mime-magic --guess-mime-type dist/* s3://student-fe`
- **Configure AWS**: `aws configure`
- Open browser: `http://localhost:3039`

## TODO
[ ] show weekly schedule and handle errors
[ ] fix main page not found
[ ] handle sign in error