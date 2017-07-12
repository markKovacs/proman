
# DEVELOPER NOTES


## Design Improvements

- h1 formatting
- enhance cards page display visually (similar to boards, maybe 4 colored columns)
    + card-title css, textarea
    + html structure in cards_dom.js - getCardHTML function
- drag and drop animation change
- sandwich menu in mobile view

## New Features

- edit board title

- modal delete confirmation

- board pagination / ordering / filtering / searching

- profile page
    + register page remains the same, simple
    + profile page can be accessed from menu bar
    + everything is in editable version and is a big form that can be submitted right away
        - validation applies upon submitting to all fields
        - account_name cannot be edited, only password, desc, profile pic
    + upon first login, get notification (once implemented) to upload profile picture and fill in description
    + profile pic can be seen in menu bar, placeholder pic

- cards/boards should have a description - varchar(255)
    + cards:
        - shown in modal upon click on card-div
        - can be added and edited from modal, after clicking edit, then submit, which does not close modal
    + boards:
        - button on board div will open modal for board description
        - there it can be edited after pressing edit button, then submit, do not close modal
    + in the modal 'Edit Description' button makes textarea editable

- teams
- accounts_teams
- search
- messages
    + ajax call every few seconds
    + toast messages
- notifications
    + ajax call every few seconds
    + toast messages
- mobile drag and drop

- limit boards/user or team, limit cards / board

## Database Changes Needed

- cards:
    + NEW: description varchar(255) NOT NULL
    + NEW: assigned_to varchar(x) default=NULL
    + assigned by and assigned when?, created by?
- boards:
    + NEW: team_id integer
    + MODIFY: account_id can be NULL
    + account_id || team_id as owner (either of them is NULL) - FK needs adjustment
- accounts:
    + profile_pic (NEW)
    + description (NEW)
- accounts_teams (NEW):
    + id
    + account_id
    + team_id
    + role
    + join_date
- teams (NEW):
    + id
    + name
    + primary_category
    + secondary_category
    + description
    + owner
    + creation_date
