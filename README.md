# Valigator

Valigator is a lazy validation builder library. It allows for the reuse of validation across your code in an easy-to-use manner. 

Usually, when doing validation, people end up writing validation logic in the constructor which is okay but you don't really end up being able to easily share that validation functionality across classes. 

The idea is to somewhat decouple validation from your classes. So you perform validation based on a set of criteria. If you fulfill the criteria you should be able to create your Model based on that data. 

The validator is a builder that takes validation functions to execute. You pass in the property, whether or not its optional and the list of validation functions you would like to run on the property

![image](https://cloud.githubusercontent.com/assets/14280155/11577118/5c5d2b42-99e9-11e5-868f-d95a3ea55352.png)

First we initialize a class instance so that we can have many validators configured in different ways. I know it's not functional but hey it works pretty well. 

So we add a property to be validated called <b>'name'</b>, set it to be required for validation <b>'true'</b>, and have 2 functions that need to be run that convey the criteria for success. Note they return an Object that has 2 keys, <b>success</b> and <b>message</b>. <b>success</b> is a boolean that conveys if the validation function thinks that the data passes its test and <b>message</b> is to represent an error message if the data does not meet the criteria. 

In order to validate data, you can do something like this:

![image](https://cloud.githubusercontent.com/assets/14280155/11577163/b61da0bc-99e9-11e5-85d6-71c6772345a1.png)

Remember, we named our class instance <b>validator</b>. 

Notice our object that we are validating has a property name with value <b>'Dexter'</b>

Our validation will loop through all the registered properties you want it to validate on (you used add in order to add criteria and properties for validation) and make sure that your object contains those properties and your object's properties meets that criteria. 

And that's really it. It's simple but it's very powerful and even on its way to being somewhat functional. Now you can reuse your validation functions across different validator instances and do some cool stuff. 

Please note that we made it so that your validation functions don't simply return Boolean, they need to return an object that contains the success of the validation but also an error message. So please remember that when writing validation functions. You may still leverage other libraries to do the actual validation but you will need to wrap them to account for this.
