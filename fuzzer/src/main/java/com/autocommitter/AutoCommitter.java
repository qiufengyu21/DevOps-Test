package com.autocommitter;

import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.dircache.DirCache;
import org.eclipse.jgit.lib.Ref;
import org.eclipse.jgit.revwalk.RevCommit;

import com.fuzzer.Fuzzer;

public class AutoCommitter {

	public static void main(String[] args) throws Exception {

		int fuzzCount = 1;

		for (int i = 0; i < fuzzCount; i++) {
			// Creation of a temp folder that will contain the Git repository
			
			// System.out.println("Credentials: " + System.getenv("GITAUTH"));

			String workspace = "/var/lib/jenkins/workspace/iTrust2-v2";
			File workingDirectory = new File(workspace);
			Git git = Git.open(new File (workspace + "/.git"));
			System.out.println("Git opened");

//			Files.copy(new File(
//					"C:/Users/shash/DevOps/milestone-2/BuildTestAnalysis/fuzzer/src/main/resources/com/fuzzer/DummyFile.java")
//							.toPath(),
//					new File(workingDirectory + "/DummyFile.java").toPath(), StandardCopyOption.REPLACE_EXISTING);
//			System.out.println("File copied");
			
			Fuzzer.filesFuzzer(workingDirectory);

			Ref ref = git.checkout().setCreateBranch(true).setName("fuzzedBranch").call();

			DirCache index = git.add().addFilepattern(".").call();
			RevCommit commit = git.commit().setMessage("Commit number: " + i).call();
			System.out.println("Git committed number: " + i);

//			PushCommand pushCommand = git.push();
//			pushCommand.setCredentialsProvider(credentialsProvider);
//			pushCommand.call();
//			System.out.println("Git pushed");

			triggerJenkinsBuild();

			//letting jenkins finish up the built
			Thread.sleep(10 * 1000);
			
		}
	}

	private static void triggerJenkinsBuild() {
		try {
			//update token 
			URL url = new URL("http://localhost:9080/job/iTrust2-v2/build?token=trigger_token");
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			int responseCode = con.getResponseCode();
			//System.out.println("\nSending 'GET' request to URL : " + url);
			System.out.println("Response Code : " + responseCode);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
