import { expect } from "playwright/test";
import { colord } from "colord";

export function isValidEmail(email: string): boolean {
    try {
      const emailurl = new URL(`mailto:${email}`);
      return emailurl.pathname.includes('@');
    } catch {
      return false;
    }
  }

export function isValidURL(_url: string): boolean {
    try {
        new URL(_url);
        return true;
    } catch {
        return false;
    }
}

export function isValidPic(url: string): boolean {
    try {
        const givenURL = new URL(url);
        const imgFormat = givenURL.pathname.split('.').pop()?.toLowerCase() === 'jpg';
        return true;
    } catch {
        return false;
    }
}

export function isValidColor(color: string): boolean {
    return colord(color).isValid();
}

export function hasGeneralProps(givenData: Record<string, any>){
    expect(givenData).toHaveProperty('data');
    
    expect(givenData).toHaveProperty('support');
    const supportData = givenData.support;
      
    expect(supportData).toHaveProperty('url');
    expect(supportData).toHaveProperty('text');
      
    expect(isValidURL(supportData.url)).toBe(true);
      
    expect(supportData.text).not.toBe('');
}

export function checkUserInfo(user: Record<string, any>) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('avatar');
    
    expect(isValidEmail(user.email)).toBe(true);
    expect(isValidPic(user.avatar)).toBe(true);
    
    expect(user.first_name).not.toBe('');
    expect(user.last_name).not.toBe('');
}

export function checkResourceInfo(resource: Record<string, any>) {
    expect(resource).toHaveProperty('id');
    expect(typeof resource.id).toBe('number');  

    expect(resource).toHaveProperty('name');
    expect(typeof resource.name).toBe('string'); 

    expect(resource).toHaveProperty('year');
    expect(typeof resource.year).toBe('number');

    expect(resource).toHaveProperty('color');
    expect(typeof resource.color).toBe('string');


    const isColor = isValidColor(resource.color);
    expect(isColor).toBe(true);
}