require("dotenv").config();
const { Amplify, Auth, Storage, API } = require("aws-amplify");

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: process.env.AWS_COGNITO_REGION,
        userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
        userPoolWebClientId: process.env.AWS_COGNITO_APP_CLIENT_ID
    },
    Storage: {
        region: process.env.AWS_S3_REGION,
        bucket: process.env.AWS_S3_BUCKET,
        identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID
    },
    API: {
        endpoints: [{
            name: "recipes",
            endpoint: process.env.AWS_API_GATEWAY_URL,
            region: process.env.AWS_API_GATEWAY_REGION
        }]
    }
});

module.exports = {
    signIn: async (mail, password) => await Auth.signIn(mail, password),
    fetchRecipe: async (id) => await API.get("recipes", `/recipes/${id}`),
    s3Download: async filename => await Storage.get(filename)
};