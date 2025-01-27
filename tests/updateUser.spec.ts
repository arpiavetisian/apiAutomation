import { test, expect, request } from '@playwright/test';
import userdata from './utils/userdata.json'
import { baseURL } from '../playwright.config';

test.describe('Update existing user credentials using put request', () => {

    let updatedUser: Record<string, any>;
    let inputData = userdata.put.updateUser;
    test.beforeAll('Send request and get success status code', async({request}) => {
        const user_id = 2;
        const response = await request.put(`${baseURL}/users/${user_id}`,{
            data: inputData,
        });
        expect(response.status()).toBe(200);
        updatedUser= await response.json();
    });

    test('Validate response body matches to the expected one', () => {
        expect(updatedUser.name).toBe(inputData.name);
        expect(updatedUser.job).toBe(inputData.job);
        expect(updatedUser.updatedAt).toBeDefined();

        console.log('User created successfully (POST):', updatedUser);
    });
    
});