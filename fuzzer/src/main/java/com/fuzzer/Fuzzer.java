package com.fuzzer;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.expr.BinaryExpr;
import com.github.javaparser.ast.expr.BinaryExpr.Operator;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

public class Fuzzer {
	public static void listOperations(File projectDir) {
		new DirExplorer((level, path, file) -> path.endsWith(".java"), (level, path, file) -> {
			System.out.println("Path: " + path);
			CompilationUnit cu = null;
			try {
				cu = JavaParser.parse(file);
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			try {
				new VoidVisitorAdapter<Object>() {
					@Override
					public void visit(BinaryExpr n, Object arg) {
						super.visit(n, arg);
						if (n.getOperator().equals(Operator.PLUS)) {
							n.setOperator(Operator.MINUS);
						} else if (n.getOperator().equals(Operator.MINUS)) {
							n.setOperator(Operator.PLUS);
						} else if (n.getOperator().equals(Operator.MULTIPLY)) {
							n.setOperator(Operator.DIVIDE);
						} else if (n.getOperator().equals(Operator.DIVIDE)) {
							n.setOperator(Operator.MULTIPLY);
						} else if (n.getOperator().equals(Operator.EQUALS)) {
							n.setOperator(Operator.GREATER);
						} else if (n.getOperator().equals(Operator.GREATER)) {
							n.setOperator(Operator.EQUALS);
						}
					}
				}.visit(cu, null);
			} catch (Exception e) {
				e.printStackTrace();
			}
			saveToFile(file, cu.toString());
		}).explore(projectDir);
	}

	private static void saveToFile(File file, String modifiedCode) {
		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(new FileWriter(file));
			writer.write(modifiedCode);
			// System.out.println("Code: " + modifiedCode);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (writer != null)
					writer.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public static void main(String[] args) {
		File projectDir = new File(
				"C:/Users/shash/DevOps/milestone-2/BuildTestAnalysis/fuzzer/src/main/resources/com/fuzzer/");
		System.out.println("ProjectDir: " + projectDir);
		listOperations(projectDir);
	}
}
