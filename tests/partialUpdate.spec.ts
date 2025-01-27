import { test, expect, request } from '@playwright/test';
import userdata from './utils/userdata.json'
import { baseURL } from '../playwright.config';

test.describe('Update existing user credentials partially using patch request', () => {

    let partialUpd: Record<string, any>;
    let inputData = userdata.patch.partialUpdateUser;
    test.beforeAll('Send request and get success status code', async({request}) => {
        const user_id = 2;
        const response = await request.patch(`${baseURL}/users/${user_id}`,{
            data: inputData,
        });
        expect(response.status()).toBe(200);
        partialUpd= await response.json();
    });

    test('Validate response body matches to the expected one', () => {
        expect(partialUpd.name).toBe(inputData.name);
        expect(partialUpd.job).toBe(inputData.job);
        expect(partialUpd.updatedAt).toBeDefined();

        console.log('User created successfully (POST):', partialUpd);
    });
    
});