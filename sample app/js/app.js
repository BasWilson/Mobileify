// Create the actualy app variable
var app;

// Create a simple theme, add as many elements as you want here
var theme = new ThemeifyTheme(
    [
        // Mobileify element
        new ThemeifyElement(
            '.mobileify', // dom selector
            new ThemeifyCss(
                'background-color: #ffffff; color: #000000; font-family: Arial, Helvetica, sans-serif;', // CSS for the light theme
                'background-color: rgb(0, 1, 87); color: #c7c5ff;' // CSS for the dark theme
            ),
        ),
    ]
);

// Assign a MobileifyApp object to the app variable
app = new MobileifyApp(
    {
        name: 'Sample App', // The app name
        description: 'An hello world app for Mobileify', // The app's description
        navbar: true // Does it have a navbar or not?
    },
    theme // The theme we previously made
);


// Add a view to the app
app.addView(new MobileifyView(
    {
        name: "Screen 1", // View name, can containt spaces but no special characters
        header: true, // Does it have a header?
        navbar: { // Show the navbar on this page
            icon: 'assets/navbar_icon.png'
        }
    },

    // The actual HTML content of this view
    `
        <div style="padding: 20px">
            <h1>Hello world!</h1>
            <button onclick="app.changeView('Screen 2')">Go to screen 2</button>
        </div>
    `
));

// Add a view to the app
app.addView(new MobileifyView(
    {
        name: "Screen 2", // View name, can containt spaces but no special characters
        header: true, // Does it have a header?
        navigatable: true
    },

    // The actual HTML content of this view
    `
    <div style="padding: 20px">
        <h1>Hello world 2!</h1>
    </div>    
    `
));