
# DEVELOPER NOTES

## NEXT

- manage members:
    + send invites
    + revoke sent invites
    + accept/decline requests
    + manage existing members (name - role pairs)
        - change role (only of members, rest is fixed as editor)

- FAQ: explaining roles and functions of ProMan

- manager and owner should be editor of all team boards at all times (board connections automatically added if promoted to manager by owner)
- only owner can promote someone to manager
- owner should also get editorship over all boards automatically
- or maybe if someone is owner or manager, they do not need board connections at all, they skip that part and get it even though!!!!

- dashboard could be have these features:
    + every X seconds new stories prepended on top (almost like fb)
    + on scrolling down, older stories will be loaded

- create some sort of "log" table that logs all notable activity for dashboard

- messsages MESSAGE LOL!!!!

- profile, edit profile, accept/decline invites, send requests, cancel requests

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
