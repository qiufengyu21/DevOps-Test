[Test and Analysis Milestone](../README.md) | [Coverage/Jenkins Support](/reports/Coverage.md) | [Test Prioritization Analysis](/reports/TestPrioritization.md)

[Automated Test Generation](/reports/TestGeneration.md) | [Team Details](/reports/Team.md) | [Screencast](/reports/Screencast.md)

Automated Commit Generation - Commit Fuzzer
----------------------------------

This section describes the [auto-committer](/fuzzer/src/main/java/com/autocommiter/AutoCommitter.java) and [fuzzer.](/fuzzer/src/main/java/com/fuzzer/Fuzzer.java). We have written java code which will read all the java files that are present in iTrust code and then we will apply fuzzing to it. We have used java parser to get the Abstract Syntax Tree of each java file. Then we used visitor to each node of the tree and performed following manipulations.

1. String Manipulations

    We have replaced string literals in java file with reverse of the same strings.

2. Integer Manipulations

    We have swapped occurance of 0s with 1s in any integer values.

3. Operator Manipulations

    We have performed variety of operator manipulations. Follwing are the combinations that we performed.

    - Swapped "+" with "-"

    - Swapped "-" with "+"

    - Swapped "*" with "/"

    - Swapped "/" with "*"

    - Swapped "==" with "!="

    - Swapped ">" with "<"

    - Swapped "!=" with ">"

    - Swapped "<=" with "=="

We have performed randomization in both choosing the files and performing above operations. So not all files are chosen and also in chosen file not all operations are performed for all expressions. For some expressions it may be performed and for some it won't be performed. After making these changes we commit the changes and perform the jenkins build. And after build is completed we again reset the changes performed so actual code is not changed. 


[<<< Previous](/reports/Coverage.md) | [Next >>>](/reports/TestPrioritization.md)