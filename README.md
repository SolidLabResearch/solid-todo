# Solid-Todo
Todo application which saves the todos on your Solid-pod. There is a live version hosted on GitHub Pages [here](https://solidlabresearch.github.io/solid-todo-app-react/).

## Features
- Web application to manage the to do list of a user after logging in.
- The user should be able to choose how (one file / multiple files) and where (directory structure) to do's should be stored.
- To do lists can be shared with other people.
- Users can assign to do's to other people.

## Running locally

After cloning the repository, install dependencies:

```
npm ci
```

Then start the Webpack development server:

```
npm run start
```
 
## Challenge completion criteria

- [x] Login with WebId (at least Inrupt and CSS)
- [x] Query Todo-Items from Pod and display them in the app
- [x] Create new Todo-Items and store them in the pod
- [x] Edit Todo-Items and update them in the pod
- [ ] Share Todo-Lists and assign Todo-Items to different people
- [ ] Allow user to choose how (one file / multiple files) and where (directory structure) to Todo-Items should be stored. 
