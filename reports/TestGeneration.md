[Test and Analysis Milestone](../README.md) | [Coverage/Jenkins Support](/reports/Coverage.md) | [Automated Commit Generation - Commit Fuzzer](/reports/Fuzzer.md)

[Test Prioritization Analysis](/reports/TestPrioritization.md) | [Team Details](/reports/Team.md) | [Screencast](/reports/Screencast.md)

Automated Test Generation
----------------------------------

The automated test generation for this milestone was a combination of unit test and integration test. We used the Test Generation Workshop as a starting point and guidance and came up with an algorithm to analyze the checkbox.io's server-side code using esprima. We traversed the entire AST tree of the server.js file and was able to extract all API routes. Once all API routes have been retrieved from the source code, we then pass the routes to a test generator, which generates simple test cases by using the nodejs request module: ```request({ url: "http://127.0.0.1/api/study/vote/status", method: "get" })```

The automatically generated test cases were stored in a separate file so that we can easily run it when the checkbox.io server is up and running. Meanwhile, we put ```istanbul-middleware``` sitting between the tests and the server to gather information about the coverage.

We were able to successfully generate 15 tests to hit different endpoints for almost all the API routes. The original coverages for each API routes are:
![Coverage Before](/reports/screenshots/coverage_before.png "Coverage Before")

After running the test, the coverage increased to:
![Coverage After](/reports/screenshots/coverage_after.png "Coverage After")

After running the test, all API routes coverage have been improved except for the upload.js file, it is because the server never had a route for /api/upload, it was commented out.

[<<< Previous](/reports/TestPrioritization.md) | [Next >>>](/reports/Team.md)
