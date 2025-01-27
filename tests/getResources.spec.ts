import { test, expect, request} from "@playwright/test";
import { baseURL } from "../playwright.config.ts";
import * as Helpers from "./utils/helperfuncs.js";

//Making test description for the get request of all resources list 
test.describe('Validation of all resources get request', () => {

    let allResources: Record<string, any>;

    test.beforeAll('Get all results of resources and validate status code', async({request}) => {
        const response = await request.get(`${baseURL}/unknown`)

        expect(response.status()).toBe(200);
        allResources = await response.json();
    })

    test('Verify the response structure for all resources', () => {
        Helpers.hasGeneralProps(allResources);
        expect(allResources).toHaveProperty("page");
        expect(allResources).toHaveProperty("per_page");
        expect(allResources).toHaveProperty("total");
        expect(allResources).toHaveProperty("total_pages");
        allResources.data.forEach((resource: any) => {
            Helpers.checkResourceInfo(resource);
        });
    });

});


// Single and non-existing resources get request validation
test.describe('Validate response for single resource get request and for non-existing resource', () =>{
    let res_id = 2;
    let singleRes: Record<string, any>;

    test.beforeAll('Get existing single response and check status code', async({request}) => {
        const respresource = await request.get(`${baseURL}/unknown/2`);

        expect(respresource.status()).toBe(200);
        singleRes = await respresource.json();
    })

    test('Verify response structure for existing single resource', async () => {
        Helpers.hasGeneralProps(singleRes);

        const resData = await singleRes.data;
        Helpers.checkResourceInfo(resData);
    });

    test('Verify that for non-existing users 404 status code and empty response is returned', async({request}) =>{
        res_id = 23;
        const noresURL = `${baseURL}/users/${res_id}`;

        const noRes = await request.get(noresURL);
        const noData = await noRes.json();

        expect(noRes.status()).toBe(404);
        expect(noData).toEqual({});
    })
})