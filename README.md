# Design-Patterns-JS

I'm in the process of learning JavaScript, and now i settled on Design Patterns.So, I decided to practice with the theory and keep it all here. For each pattern, i decided to come up some task or a small example, which would help me understand the pattern and try to do it.

In repository i have 2 folders: first folder with ES5 code and second with ES6+ code. I will try to implement scripts in both standards, sometimes using jquery or other libraries as well. In this two main folder will be folders with the names of the design patterns and each of these folders will have the simplest architecture possible, which will probably consist of several files.

ES6+ Folder
In app/src you can see 2 main files and folder with templates, which i use in design pattern implementation: index.js, index.html and templates. Templates directory contains different template folders with template files ( styles, js with data, images ). Since i will use a small amount of templates in each design pattern implementation, i decided to move it to a separate folder ( templates ). To see the selected pattern in action you need in index.js import the main file of pattern. Basically it called like DesignPatternName.js. It possible, bacause i decided to use custom elements.
For each design pattern i have seperate folder which contains 2 main files: Implementation of design pattern .js and .scss file with styles. Also it can contains  html template in .js format of design pattern, but the general templates are located in src/templates folder.

Most of explanation are in main pattern files in comments.
