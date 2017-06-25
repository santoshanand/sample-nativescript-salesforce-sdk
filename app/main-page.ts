/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { HelloWorldModel } from './main-view-model';
import {
  Auth,
  IWebAuth,
  Apex
}from 'nativescript-salesforce-sdk'
let model:HelloWorldModel;
let config:IWebAuth = {
  clientId:'3MVG9YDQS5WtC11p8U6jHYOrOLWdUuHO5tK5jXMv0mQCyzZ0cdjYUd93RGSCpQdP87VL6hQbUO3fXYRmAkJxq', 
  calbackUrl:'ns://nativescript/sdk', 
  loginUrl:'https://login.salesforce.com' 
};
// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    let page = <Page>args.object;
    
    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and TypeScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().

    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    model = new HelloWorldModel();
    page.bindingContext = model;
}

export function navigatedTo(args:EventData) {
  let page = <Page>args.object;
  
  let auth:Auth = new Auth(page);
  auth.on('success', (data)=> {
    console.log('Success');
    Apex.query('select id, Name from Contact')
      .then((data)=> {
      // console.log(JSON.stringify(data.content.toJSON().totalSize));
      if(model !== undefined) {
        model.items = data.content.toJSON().records;
      }
    }).catch((err) => {
      console.log(JSON.stringify(err));
    });
  });
  auth.login(config);
}