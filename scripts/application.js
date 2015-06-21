/**
 * Created by thram on 21/06/15.
 */
thram.routes = [
    {route: '/', view: 'dashboard'},
    {route: "/:app_namespace", view: 'details'}
];

thram.views.add('base', Base);
thram.views.add('dashboard', Dashboard);
thram.views.add('details', Details);

thram.models.add('application', Application);

thram.toolbox.add('fake.data', FakeData);
thram.toolbox.add('syntax.highlight', SyntaxHighlight);

thram.start();