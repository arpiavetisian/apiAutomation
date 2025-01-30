import { test, expect, request} from "@playwright/test";
import authData from "./utils/authData.json";
import loginData from "./utils/loginData.json"

let token: string;
test.describe('Validate Register requests functionality based on status code and token', () => {

    authData.forEach((testCase) => {
        test.beforeAll(`should handle: ${testCase.description}`, async ({baseURL,request }) => {
            const response = await request.post(`${baseURL}/register`, {
                data: testCase.data,
            });
    
            expect(response.status()).toBe(testCase.expectedStatus);
        
            const actualResponse = await response.json();
            
            if (testCase.expectedStatus === 200 && testCase.expectedFields) {
                testCase.expectedFields.forEach((field) => {
                    expect(actualResponse[field]).toBeDefined();
                });
                token = await actualResponse.token;
            }

            if (testCase.expectedStatus === 400) {
                expect(actualResponse.error).toBe(testCase.expectedError);
            }
        });
    });


    test.describe('Validate Log In requests functionality based on status code and token', () => {

        loginData.forEach((loginCase) => {
            test(`should handle: ${loginCase.description}`, async ({baseURL,request }) => {
                const response = await request.post(`${baseURL}/login`, {
                    data: loginCase.data,
                });
        
                expect(response.status()).toBe(loginCase.expectedStatus);
            
                const actualResponse = await response.json();
                
                if (loginCase.expectedStatus === 200 && loginCase.expectedFields) {
                    expect(actualResponse[loginCase.expectedFields]).toBeDefined();
                    
                    const logintoken = await actualResponse.token;
                    expect(logintoken).toEqual(token)
                }

                if (loginCase.expectedStatus === 400) {
                    expect(actualResponse.error).toBe(loginCase.expectedError);
                }
            });
        });
    });
});