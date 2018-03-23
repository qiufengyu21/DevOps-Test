[Test and Analysis Milestone](../README.md) | [Coverage/Jenkins Support](/reports/Coverage.md) | [Automated Commit Generation - Commit Fuzzer](/reports/Fuzzer.md)

[Automated Test Generation](/reports/TestGeneration.md) | [Team Details](/reports/Team.md) | [Screencast](/reports/Screencast.md)

Test Prioritization Analysis
----------------------------------

For test prioritization we wrote a javascript file to collect and prioritize the test results based on jenkins builds of 100 fuzzer commit. We read content of each file and aggegated the data. For this we first collected the data from each build in an array of object "test". Where each object contained the information like test name, no of time it passed, no of time it failed, total time it took to run for 100 build and average time taken by each build. After that we prioritize the given test on the following criteria. First criteria was of top priority, if multiple test case had ties in the first criteria then we followed second and so on.

1. Descending order of no of times failed

2. Ascending order of average time taken to run

3. Ascending order of total time taken to run

We followed this order because, failing tests are always more useful than the passing tests. So we gave the highest priority to the test which failed repeatedly. After that we chose the test cases which can be tested in least amount of time. We again chose this criteria to prioritize test cases because we can give priority to those test cases which can be tested in less amount of time. Overall using this strategy we can discover more bugs in less amount of time.

**Why do you think those tests were ranked the highest?**

The highest ranked test cases failed repeatedly. Thare may be several reasons behind that. After performing fuzzing the part these test cases were testing was very much strictly expecting structured input. Randomizing the input caused them failing most number of times. Also these tests took very less time to execute. So the code that it was testing might be very sensitive, so that it failed as soon as we provided small amount of random input.

[<<< Previous](/reports/Fuzzer.md) | [Next >>>](/reports/TestGeneration.md)