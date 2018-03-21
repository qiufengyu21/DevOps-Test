package com.autocommitter;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Properties;

import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.ResetCommand;
import org.eclipse.jgit.api.ResetCommand.ResetType;
import org.eclipse.jgit.dircache.DirCache;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Ref;
import org.eclipse.jgit.lib.RepositoryBuilder;
import org.eclipse.jgit.revwalk.RevCommit;

import com.fuzzer.Fuzzer;

public class AutoCommitter {

	public static void main(String[] args) throws Exception {
		
		Properties prop = getDetails();

		//Create git repo object and set workspace to fuzz
		//String workspace = "/home/vagrant/iTrust2-v2";
		String workspace = prop.getProperty("gitHome");
		Git git = Git.open(new File (workspace + "/.git"));
		File workingDirectory = new File(workspace+"/iTrust2/src/main/edu/ncsu/csc/itrust");
		
		//Create "fuzzer" branch and get sha1
		git.checkout().setName("fuzzer").call();
		
		int fuzzCount = 30;
		String masterBranch = prop.getProperty("masterBranch");

		for (int i = 0; i < fuzzCount; i++) {
			//reset
			//git.reset().setMode(ResetType.HARD).setRef("refs/heads/master").call();
			git.reset().setMode(ResetType.HARD).setRef(masterBranch).call();
			//fuzz files
			Fuzzer.filesFuzzer(workingDirectory);
			//track and commit
			git.add().addFilepattern(".").call();
			git.commit().setMessage("Commit number: " + i).call();
			//trigger build
			triggerJenkinsBuild(prop);
			
			Thread.sleep(660 * 1000);
		}
	}
	
	private static void triggerJenkinsBuild(Properties prop) {
		try {
			//update token 
			//URL url = new URL("http://127.0.0.1:9080/job/iTrust2-v2/build?token=trigger_token");
			String jenkinsIP = prop.getProperty("jenkinsIP");
			String jenkinsPort = prop.getProperty("jenkinsPort");
			String jobName = prop.getProperty("jobName");
			String triggerToken = prop.getProperty("triggerToken");
			URL url = new URL("http://"+jenkinsIP+":"+jenkinsPort+"/job/"+jobName+"/build?token="+triggerToken);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			int responseCode = con.getResponseCode();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private static Properties getDetails() {
		Properties prop = new Properties();
		InputStream input = null;
		
		try {
			input = new FileInputStream("./test.properties");
			prop.load(input);
			
			System.out.println(prop.getProperty("gitHome"));
			System.out.println(prop.getProperty("jenkinsIP"));
			System.out.println(prop.getProperty("jenkinsPort"));
			System.out.println(prop.getProperty("jobName"));
			System.out.println(prop.getProperty("triggerToken"));
		} catch(IOException i) {
			i.printStackTrace();
		} finally {
			if(input != null) {
				try {
					input.close();
				} catch(IOException i) {
					i.printStackTrace();
				}
			}
		}
		
		return prop;
		
	}
	
	private static void copyReports(int iterNum) {
		try {
			FileUtils.copyFile(new File("/var/lib/jenkins/workspace/iTrust2-v2/iTrust2/target/site/jacoco-it/jacoco.xml"), new File("/home/vagrant/sample_reports/jacoco-it/"+iterNum+".xml"));
			FileUtils.copyFile(new File("/var/lib/jenkins/workspace/iTrust2-v2/iTrust2/target/site/jacoco-it/jacoco.csv"), new File("/home/vagrant/sample_reports/jacoco-it/"+iterNum+".csv"));
			FileUtils.copyFile(new File("/var/lib/jenkins/workspace/iTrust2-v2/iTrust2/target/site/jacoco-ut/jacoco.xml"), new File("/home/vagrant/sample_reports/jacoco-ut/"+iterNum+".xml"));
			FileUtils.copyFile(new File("/var/lib/jenkins/workspace/iTrust2-v2/iTrust2/target/site/jacoco-ut/jacoco.csv"), new File("/home/vagrant/sample_reports/jacoco-ut/"+iterNum+".csv"));
		} catch (IOException i) {
			i.printStackTrace();
		}
	}
}
