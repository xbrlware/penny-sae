#!/bin/bash

read -p 'Username: ' uservar
read -sp 'Password: ' passvar

./node_modules/karma/bin/karma start --username=$uservar --password=$passvar
