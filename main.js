#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const figlet = require("figlet");
const chalk = require("chalk");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventEmitter = require("events").EventEmitter;

//Event
let appState = new EventEmitter();

//Connect to the Database
mongoose.connect("mongodb://localhost/contact_list", (err) => {
    if (err) console.error("Database Connection Error " + err);
    else {
        //console.log("Connected To Database!");
        //appState.emit("Connected");
    }
});

//CREATE Schema
let ContactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
});

//Create Model
let Contact = mongoose.model("Contacts", ContactSchema);

/*
let contacts = [
{ name: "IslemPenywis", number: 29931952441 },
{ name: "Alex", number: 28003546431 },
{ name: "Mike", number: 2883158471 },
{ name: "Lily", number: 5383514251 },
{ name: "Chroose", number: 2565158471 },
{ name: "kris", number: 5623495321 }
];
*/

//Adding Questions
let questions = [{
        type: "Input",
        name: "name",
        message: "Enter Your Name.. ",
        validate: answers => {
            if (answers.length < 1) return "Please Enter your First Name";
            return true;
        }
    },
    {
        type: "Input",
        name: "number",
        message: "Enter Your Number..",
        validate: function(answers) {
            if (answers.length < 1) return "Please Enter a Valid Phone Number";
            else {
                let regx = /^\d{10}$/;
                if (!regx.exec(answers))
                    return "Please Enter a Valid Phone Number";
                else return true;
            }
        }
    },
    /*{
        type: "list",
        name: "gender",
        message: "Select Gender..",
        choices: [
            new inquirer.Separator(" => Gender <= "),
            {
                name: "Male"
            },
            {
                name: "Female"
            }
        ],
        validate: function(answers) {
            if (answers.length < 1) return "Please Choose Your Gender";
            return true;
        }
    }*/
];


mongoose.Collection

program.command("addContact").description("Add new Contact").action(() => {

    inquirer.prompt(questions).then((answers) => {

        let contct = new Contact({
            name: answers.name,
            number: answers.number
        });
        contct.save((err, ct) => {
            if (err) console.error("Cannot Add new Contact");
            console.log(chalk.green("Contact Added Successfully! " + ct));
        });
    });

});

function findContact() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Enter Contact Name..."
    }]).then((answers) => {
        Contact.find({
            name: answers.name
        }, (err, cn) => {
            return cn[0];
        });
    });
}

//Command for Searching
program.command("find").description("Find a Contact").action(() => {
    //Ask for Name
    //let cn = findContact();
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Enter Contact Name..."
    }]).then((answers) => {
        Contact.find({
            name: answers.name
        }, (err, cn) => {
            if (err) console.error("Error Finding Contact " + answers.name + "  " + err);
            else {
                console.log(chalk.blue(answers.name + " number is : " + cn[0].number));
            }
        });
    });
});

//Delete from Database
program.command("remove").description("Delete a Conatct").action(() => {
    //Find conatct by name
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Enter Contact Name..."
    }]).then((answers) => {
        Contact.find({
            name: answers.name
        }, (err, cn) => {
            Contact.findByIdAndRemove(cn[0]._id, (err, dlt) => {
                if (err) console.error("Error Deleting Contact " + answers[0].name);
                console.log(chalk.red(answers[0].name + " Has been deleted from Database"));
            });
            //console.log(chalk.blue(cn.name + " number is : " + cn.number));
        });
    });

});

program.parse(process.argv);