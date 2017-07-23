
# DEVELOPER NOTES

## NEXT

- leave team (only if not owner, displayed on teams page, last column)

- teams page:
    + create team
    + manage members

- FAQ: explaining roles and functions of ProMan

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
