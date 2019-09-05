# ZURB Template


- Handlebars HTML templates with Panini
- Sass compilation and prefixing
- JavaScript module bundling with webpack
- Built-in BrowserSync server
- For production builds:
  - CSS compression
  - JavaScript module bundling with webpack
  - Image compression




This template can be installed with the Foundation CLI, or downloaded and set up manually.
### Using the CLI

Foundation CLI Global Install:

- +foundation-cli --global

Blank Foundation [for] Sites Project:

```bash
foundation new --framework sites --template zurb
```






                        ¸.•`|´•.˛                         
                        |  ¸|˛  |                         
                        | ¸ | ˛ |                         
                        |  ¸|˛  |                         
                        | ¸ | ˛ |                         
                        |  ¸|˛  |                         
                        | ¸ | ˛ |                         
                   .    |  ¸|˛  |    .                    
                   »\¸/ˇˇˇˇˇˇˇˇˇˇˇ\¸/«                    
                   »                 «                    
                   »   ** note  **   «                    
                   » incomplete list «                    
                   »   of updates/   «                    
                    »    changes    «                      
                     `°».¸     ˛.«°´
                          \   /                          
                           `.´                            
                            ˇ                             
# Known issues at first commit:
  - jQuery + Typescript + Foundation presents issues
    - Typescript + ES2015 Javascript working together causes type conflicts (among other things)
      - Main issue as of now - Initializing Foundation's JavaScript throws compile error:
        - $(document).foundation()

# Alterations to core project -- JJL

    ## Project-level changes
        - Integrated TypeScript
            -- issue with foundation's requirement for the 'app.js' file [needed to be] located in ./src/assets/js/

    ## ./package.json 





### packge.json alterations:
### attribute - x:y 
###                 [json]obj.property:  value from    /   value to

- "babel-core":  ^6.26.3        « -- »       ^7.0.0-0
- "babelify"  :  ^10.0.0        « -- »       ^8.0.0-0




### Added [npm] modules* :
#### bash commmand for all modules listed below.
```bash
npm install --save-dev @types/node @types/jquery typescript  gulp@4.0.0 gulp-typescript  browserify  tsify babelify@10  gulp-sourcemaps  vinyl-buffer  vinyl-source-stream 
```

npm install --save-dev @types/node
npm install --save-dev @types/jquery
npm install --save-dev typescript gulp@4.0.0 gulp-typescript
npm install --save-dev browserify 
npm install --save-dev tsify 


npm install --save-dev babelify@10


npm install --save-dev @babel/preset-env
npm install --save-dev gulp-sourcemaps
npm install --save-dev vinyl-buffer
npm install --save-dev vinyl-source-stream






### Depreciated NPM modules
 - Assmued that these are [depreciated &] properly replaced+updated (see depreciated section below)
( errors when running ```bash npm install || npm start || gulp ```) ? use the following ```bash npm install ``` command:
 
```bash
npm install --save-dev babel-preset-env babel-core babel-preset-es2015
```


### Depreciated -  tentative: to be removed   
#### x:y
#### x == orignially installed module 
#### y == module to replace old/depreciated module
npm install --save-dev babel-core                       : 
npm install --save-dev babel-preset-es2015              : npm install --save-dev @babel/preset-env
npm install --save-dev babel-preset-env                 : npm install --save-dev @babel/preset-env

