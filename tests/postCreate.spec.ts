import { test, expect, request } from '@playwright/test';
import userdata from './utils/userdata.json'
import { baseURL } from '../playwright.config';

test.describe('Create new user using post request', () => {

    let createdUser: Record<string, any>;
    let inputData = userdata.post.createUser;
    test.beforeAll('Send request and get success status code', async({request}) => {
        const response = await request.post(`${baseURL}/users`,{
            data: inputData,
        });
        expect(response.status()).toBe(201);
        createdUser = await response.json();
    });

    test('Validate response body matches to the expected one', () => {
        expect(createdUser.name).toBe(inputData.name);
        expect(createdUser.job).toBe(inputData.job);
        expect(createdUser.id).toBeDefined();
        expect(createdUser.createdAt).toBeDefined();

        console.log('User created successfully (POST):', createdUser);
    });
    
});
