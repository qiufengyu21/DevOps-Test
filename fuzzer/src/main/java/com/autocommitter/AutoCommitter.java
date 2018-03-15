package com.autocommitter;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.PushCommand;
import org.eclipse.jgit.dircache.DirCache;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;

public class AutoCommitter {

	public static void main(String[] args) throws Exception {

		// Creation of a temp folder that will contain the Git repository
		File workingDirectory = File.createTempFile("jgit-test", "");
		workingDirectory.delete();
		workingDirectory.mkdirs();
		System.out.println("Working File: " + workingDirectory.getPath());

		// System.out.println("Credentials: " + System.getenv("GITAUTH"));

		CredentialsProvider credentialsProvider = new UsernamePasswordCredentialsProvider(System.getenv("GITAUTH"), "");

		Git git = Git.cloneRepository().setURI("https://github.ncsu.edu/sjha5/RepoForJGitPushTest.git")
				.setCredentialsProvider(credentialsProvider).setDirectory(workingDirectory).call();
		System.out.println("Git cloned");

		Files.copy(new File(
				"C:/Users/shash/DevOps/milestone-2/BuildTestAnalysis/fuzzer/src/main/resources/com/fuzzer/DummyFile.java")
						.toPath(),
				new File (workingDirectory+"/DummyFile.java").toPath(), StandardCopyOption.REPLACE_EXISTING);
		System.out.println("File copied");
		

		 DirCache index = git.add().addFilepattern("DummyFile.java").call();
		 RevCommit commit = git.commit().setMessage( "Add dummy file" ).call();
		 System.out.println("Git committed");
		
		 PushCommand pushCommand = git.push();
		 pushCommand.setCredentialsProvider(credentialsProvider);
		 pushCommand.call();
		 System.out.println("Git pushed");
		
		 workingDirectory.delete();

	}

}
