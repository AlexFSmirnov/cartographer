# dnd-map-helper
Quickly look up location descriptions by clicking on a corresponding map region.

# Requirements
- Allow multiple regions
  - e.g. Main map -> town map -> building map
  - need to be able to jump to specific regions without going through all the maps
    - possibly a nested sidebar?
    - potential clash between the description of a region and it's corresponding map. Show description and button to go to map?

- Should have hyperlinks to locations in descriptions, with breadcrumbs and browser history
  - Should be able to see all locations referencing the current one. Need a data structure that allows to see all outgoing and incoming links efficiently:
    - Rooms are stored in a dictionary. Each room has a `referencedBy` set. Once a new room is added, look up all references in the description. For each reference, update the set of the corresponding region. If a reference was removed, remove it from the set.

- When selecting a region, shows a dialog with the following tabs:
  - Description - shows the markdown description
  - Notes - has a multiline text field for notes
  - References - a list of rooms that reference this one

- Should have an edit mode that allows you to create regions
  - Regions are drawn as rectangles
  - When a region is created, a dialog opens up with the following fields:
    - Room code
    - Room name
    - Button to add description
      - Description is in "markdown"
    - Cancel and save buttons
  - Should have two modes - draw and select
    - When selecting an existing region, opens up the same dialog that allows you to edit it.
    - Should also have an "Edit" button when selecting a region outside of editing mode

- NOTES:
  - Should have a page that contains all notes
  - When writing notes, ideally should have autocomplete for existing regions



- FINAL ELEMENTS:
  - Path of the region
  - Nested list of all regions
  - Button to go to notes
  - Button to go to map
  - Button to start editing
    - In edit mode - switch between select and create
    - Button to upload a new map
      - Should allow selecting a parent region
  - Button to save and load configuration
  - Allow switching between projects
  - Button to import descriptions


- Arranged final elemens:
  - Header with the breadcrumbs of the current region
    - Clicking on any previous regions opens it
    - Clicking on the current regions opens a dropdown of all sibling regions

  - Bottom bar:
    - Map button
    - Notes button
    - Regions button

  - Icon button for a sidebar:
    - Project selector dropdown
      - List of all projects
      - Button to create new project

    - Export configuration
    - Import configuration

    - Import descriptions
    - Edit mode [  o]

    - Dark mode [  o]
    - Close

  - In edit mode:
    - Floating buttons for Edit and Select mode
    - Floating button for "Done" 



- REDUX BRAINSTORM
  - Need to store all existing projects, probably in a different state field to be more efficient.

  - Need to store te current project:
    - Name
    - Regions, object with one key per region. For each region:
      - Name
      - Parent
      - Floor number
      - References
      - ReferencedBy
      - Description markdown
      - Notes

  - UI stuff


- REDUX v2
  - Regions with maps
    - Can be root, can have no parent
    - Always tied to map image
  - Regions without maps
    - Keyed by id of parent
      - Keyed by id of region
        - Might be connected to a region with map
      

- REDUX STATE STRUCTURE

```js
{
  savedProjects: {
    projectName: {
      name: 'Project Name',
      ...,
    }
  },

  currentProject: {
    name: 'Current Project',
    maps: {
      K: {
        name: 'Some submap of root',
        parent: 'ROOT',
        floorNumber: null,
      }
    }
    regions: {
      K: {
        K61: {
          name: 'Some room',
          references: ['K62', 'K60'],
          referencedBy: ['K62', 'K63'],
          description: 'Blah blah #some markdown',
          notes: 'Some notes in simple text',
        }
      }
    }
  },

  ui: {

  }
}
```


- ROUTES:
  - Top level:
    - Map
    - Notes
    - Regions


https://alexfsmirnov.github.io/dnd-map-helper/<VIEW>/<SELECTED_REGION>/<SUBVIEW>

  
