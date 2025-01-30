import { test, expect, request } from '@playwright/test';

let checkdata: Record<string, any>;
test('Check delete request and get expected status code', async({baseURL,request}) => {

    const del_id = 2;
    const response = await request.delete(`${baseURL}/users/${del_id}`);

    expect(response.status()).toBe(204);

    //Double check is user deleted using get request
    const check  = await request.get(`${baseURL}/users/${del_id}`);
    const checkdata = await check.json();
    
    if (checkdata !== '') {
        console.log('Delete request did not removed user successfully')
    } else {
        console.log('User removed successfully')
    }
})