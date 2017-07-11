
# DEVELOPER NOTES


## Generic To-Do

- if editable title, dragging over it should not work
- upon dragging, make all un-editable
- only 1 card title can be editable at the same time
    + autofocus when edit button clicked
    + blur event listener --> will make it disabled
    + on blur AND upon successful title edit, global variable must be turned into undefined again
- textarea attributes!!!
- enhance cards page display visually (similar to boards, maybe 4 colored columns)
    + card-title css, textarea
    + html structure in cards_dom.js - getCardHTML function
- modal delete confirmation
- autofocus on things, create new by pressing enter
- edit board title
- h1 formatting

- validate board and card title input
    + creation
    + edit
    + validation rules:
        - 1-30 characters (overflow handling if needed)

- cards should have a description
    + varchar(255)
    + shown in modal upon click on title
    + title needs hover clickable effect
    + in the modal 'Edit Description' button (textarea)

- drag and drop animation change
- teams
- accounts_teams
- search
- messages
    + ajax call every few seconds
    + toast messages
- notifications
    + ajax call every few seconds
    + toast messages
- sandwich menu in mobile view
- mobile drag and drop

## Database Changes Needed

- cards:
    + NEW: description varchar(255) NOT NULL
    + NEW: assigned_to varchar(x) default=NULL
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
