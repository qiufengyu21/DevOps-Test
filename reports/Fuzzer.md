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

Following is the jacoco report screenshot.

![Jacoco Report](/reports/screenshots/jacoco_report.jpeg?raw=true "Jacoco Report")

**What type of problems do you think the fuzzer discovered?**

Fuzzing is a technique in which we give some random or unexpected input to a computer program and we observe the behaviour of a computer program. After performing fuzzing some tescases never failed, so we can discover that either the tests written are not useful or we still need to improve the fuzzer functionalities. It also helped in discovering issues such as race conditions and deadlocks, memory leaks and undefined behaviour. It helped in discovering control flow bugs, like we expect that "<" is correct conditional operator, but we may actually need "<=" at that place for correct behaviour.

**What are some ways fuzzing operations could be extended in the future?**

Following fuzzing operations could be extended in future.

1. String Manipulations

    Currently we are just reversing the existing string. In future we may append or prepend a specific string. We can also append or prepend a random string. We can replace the string with entirely a random string altogather. Or we can pick any of this option at random and perform different manipulations with different string literals.

2. Integer Manipulations

    Currently we just swapped '0's with '1's. As discussed in string manipulations we can randomly choose any operation with a integer literal. We can swap any random number with any other randomly chosen number. We can add, subtract, divide or multiply any randomly or specifically chosen number from the actual literal.

3. Operator Manipulations

    We are currently swapping just binary operators. In future we can swap some unary and logical operators as well.

[<<< Previous](/reports/Coverage.md) | [Next >>>](/reports/TestPrioritization.md)