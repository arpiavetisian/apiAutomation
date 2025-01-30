import { test, expect} from "@playwright/test";
import * as Helpers from "./utils/helperfuncs.js";
import {userSchema} from '../schemas/allUsersSchema.ts';
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

//Defining describe test for get request of ALL users and including each test regarding to it.
test.describe('Get All Users and validate schema', () => {
    
    let allResponse: Record<string, any>;
    test.beforeAll('Validate Response Status Code and the quantity of users in response', async({baseURL, request})  => {
        const allUserURL = `${baseURL}/users?page=2`;
        const response = await request.get(allUserURL)
        expect(response.status()).toBe(200);

        allResponse = await response.json();
    });

    test('Validate response schema and values', () => {
        // Validate the response against the JSON schema
        const validate = ajv.compile(userSchema);
        const valid = validate(allResponse);
        expect(valid).toBe(true);
        
        //Cheking response details
        expect(allResponse.page).toBe(2);
        expect(allResponse.data.length).toBeGreaterThan(0);
    });

    //Ensure proper error handling for invalid input for page as query parameter
    test("Should return error for invalid page number", async ({baseURL, request }) => {
        const response_ = await request.get(`${baseURL}/users?page=abc`);
        expect(response_.status()).toBe(400); 
    });    
       
})

//Validating GET request response for existing and non-existing single user
test.describe('Get request for single users for both existing and non-existing users', () => { 

    let user_id = 2;
    let singleBody: Record<string, any>;

    test.beforeAll('Get singke user data and check status code', async({baseURL,request}) =>{
        const singleURL = `${baseURL}/users/${user_id}`;

        const respsingle = await request.get(singleURL);
        expect(respsingle.status()).toBe(200);

        singleBody = await respsingle.json()
    })

    test('Verify single user request response body', () => {
        Helpers.hasGeneralProps(singleBody);
        const userData = singleBody.data;

        Helpers.checkUserInfo(userData);
        expect(userData.id).toBe(user_id);
    });

    test('Get request for non-existing user, shoulg get empty object', async({baseURL,request}) => {
        user_id = 23;
        const checkURL = `${baseURL}/users/${user_id}`;

        const noUser = await request.get(checkURL)
        const noData = await noUser.json();

        expect(noUser.status()).toBe(404);
        expect(noData).toEqual({});
    })

});

test.describe('Get delayed page of users', () => {
        
    let delayedResp: Record<string, any>;
    
    test.beforeAll('Validate get request for delayed page of users', async({baseURL, request}) => {
        const delayedURL = `${baseURL}/users?delay=3`
        const response = await request.get(delayedURL);

        expect(response.status()).toBe(200);

        delayedResp = await response.json();
    })

    test('Verify the structure of delayed response', async () => {
        Helpers.hasGeneralProps(delayedResp);
        expect(delayedResp).toHaveProperty("page");
        expect(delayedResp).toHaveProperty("per_page");
        expect(delayedResp).toHaveProperty("total");
        expect(delayedResp).toHaveProperty("total_pages");

        delayedResp.data.forEach((users: any) => {
            Helpers.checkUserInfo(users);
        });
    })
})