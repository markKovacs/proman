
# DEVELOPER NOTES

## Illustrations
1. basic setup in ProMan (creation process)
2. team roles, board roles
    + owner privileges:
        - create/delete board
        - promote/demote members/managers
    + manager(owner) privileges:
        - invite users to team / accept or decline join requests
        - remove members from team
    + members:
        - by default cannot see any team related boards
        - managers/owners can give access (viewer/editor) to boards individually

3. lines of code (cake) - techs used
4. database relationship diagram

## Presentation
0. Background info: who am I, course info
1. Introduction
    + title / topic: ProMan Task Manager Web Application - full stack, javascript in the focus
    + we had this school project and i decided to make some improvements
2. Technologies
    + pie-chart
3. About Proman
    + in a nutshell:
        - manage tasks within projects
        - complex to-do list with GUI
    + old version (ILLUSTRATION#1):
        - account - boards - cards
    + upgraded version (ILLUSTRATION#2):
        - account - boards - cards
        - account - teams - boards - cards
            + team access levels (owner, manager, member) - different functionality
4. Future plans:
    + Newsfeed
    + Search (Teams, Accounts)
    + Notifications
    + Messages
    + User profiles (+ accept invitations)
    + FAQ / how to use




2. background info / foreword:
    + started Codecool 5 months ago, no programming background
    + ProMan was the first complex full stack app we had to create
        - completed in groups of 4s, in 2 weeks
    + my motivation to continue ProMan as a personal project:
        - make something that is actually useful
        - took real life examples and tried to implement such features
        - extra time spent on it: 2 weeks, alone
    + keep in mind: ongoing project with many working features but not yet ready!
3. About Proman - What is it good for?
    + in a nutshell:
        - manage tasks within projects
        - complex to-do list with GUI
    + how to use:
        - register account, login
        - create/join teams
        - create/manage boards
        - add cards to boards, manage tasks
    + old version (ILLUSTRATION#1):
        - account - boards - cards
    + upgraded version (ILLUSTRATION#1):
        - ILLUSTRATION#1:
            - account - boards - cards
            - account - teams - boards - cards
        - team management (ILLUSTRATION#2):
            - team profile (title, desc, category, logo)
            - access levels within team (owner, manager, member)
            - owner, manager have full access to all boards
            - members do not have instant access to any of the boards
                - need to be added by managers/owner to each board as either VIEWER/EDITOR
4. Technologies (ILLUSTRATION#3)
    + Python - Flask microframework: webserver
    + SQL: database (ILLUSTRATION#4)
    + JavaScript (jQuery) - AJAX:
        - DOM manipulation
        - async server communication
    + HTML, CSS
5. Difficulties
    + System architecture
        - database schema
    + GUI design, responsive design
6. Future plans
    + Newsfeed
    + Search (Teams, Accounts)
    + Notifications
    + Messages
    + User profiles (+ accept invitations)
    + FAQ / how to use


## NEXT
- drag and drop animations - make nicer

- card details listener:
    + id, title, details, created, modified, assigned to, assigned by, assigned when
    + while editing, assigned to can be modified from select (all team members)

- validation/decorators where signed in main.py (client-side done)

- FAQ: explaining roles and functions of ProMan

- dashboard/news feed could be have these features:
    + every X seconds new stories prepended on top (almost like fb)
    + on scrolling down, older stories will be loaded

- create some sort of "log" table that logs all notable activity for dashboard

- messsages MESSAGE LOL!!!!

- show profile, edit profile (upload picture - shown in header), accept/decline invites, send join requests, cancel requests (maybe: check notifications/messages from here or separate menu)

## General

- Check foreign keys: on update, on delete what to do.
- Composite unique keys. Think where it is needed.


## Design Improvements

- drag and drop animation rework


## New Features

- account profile page
    + register page remains the same, simple
    + profile page can be accessed from menu bar
    + everything is in editable version and is a big form that can be submitted right away
        - validation applies upon submitting to all fields
        - account_name cannot be edited, only password, desc, profile pic
    + upon first login, get notification (once implemented) to upload profile picture and fill in description
    + profile pic can be seen in menu bar, placeholder pic

- search

- messages
    + ajax call every few seconds
    + toast messages

- notifications
    + ajax call every few seconds
    + toast messages

- mobile drag and drop

- limit boards/user or team, limit cards / board

- transition to connection pooling

- virtualenv

- python package


## Roles Explained

- team roles:
    + member:
        - cannot see anything by default
        - can be given either viewer or editor role to any team boards
            + viewer: can only view that board
            + editor: can edit any of the cards in board, delete cards, create cards, board itself cannot be edited/deleted
    + manager:
        - automatically gets editor role to all team boards
        - can also edit boards data, delete or create boards
        - invite accounts to team
        - accept/decline team joining requests
        - kick members from team
        - cannot set roles in team!
    + owner:
        - can set roles in team (member or manager)
        - can kick managers too (or demote them first and kick them then)
