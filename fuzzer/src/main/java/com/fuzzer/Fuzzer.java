package com.fuzzer;

import java.io.File;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.expr.BinaryExpr;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

public class Fuzzer {
	public static void listOperations(File projectDir) {
		new DirExplorer((level, path, file) -> path.endsWith(".java"), (level, path, file) -> {
			System.out.println("Path: " + path);
			try {
				new VoidVisitorAdapter<Object>() {
					@Override
					public void visit(BinaryExpr n, Object arg) {
						super.visit(n, arg);
						System.out.println(n.getOperator());
						//System.out.println(" * " + n.getName());
					}
				}.visit(JavaParser.parse(file), null);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}).explore(projectDir);
	}

	public static void main(String[] args) {
		File projectDir = new File(".");
		System.out.println("ProjectDir: " + projectDir);
		listOperations(projectDir);
	}
}
