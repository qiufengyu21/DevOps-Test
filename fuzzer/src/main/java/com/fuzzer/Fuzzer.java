package com.fuzzer;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.Random;

import org.apache.commons.lang3.StringUtils;
import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.expr.BinaryExpr;
import com.github.javaparser.ast.expr.BinaryExpr.Operator;
import com.github.javaparser.ast.expr.IntegerLiteralExpr;
import com.github.javaparser.ast.expr.StringLiteralExpr;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

public class Fuzzer {

	public static void filesFuzzer(File projectDir) {
		new DirExplorer((level, path, file) -> path.endsWith(".java"), (level, path, file) -> {
			
			//File ignored at p > 0.8
			if (lowProbabilityBoolean()) {
				System.out.println("Path: " + path);
				CompilationUnit cu = null;
				try {
					cu = JavaParser.parse(file);
					new VoidVisitorAdapter<Object>() {

						@Override
						public void visit(BinaryExpr n, Object arg) {
							super.visit(n, arg);
							if (randomBoolean() && n.getOperator().equals(Operator.PLUS)) {
								n.setOperator(Operator.MINUS);
							}
							if (randomBoolean() && n.getOperator().equals(Operator.MINUS)) {
								n.setOperator(Operator.PLUS);
							}
							if (randomBoolean() && n.getOperator().equals(Operator.MULTIPLY)) {
								n.setOperator(Operator.DIVIDE);
							}
							if (randomBoolean() && n.getOperator().equals(Operator.DIVIDE)) {
								n.setOperator(Operator.MULTIPLY);
							}
							if (randomBoolean() && n.getOperator().equals(Operator.EQUALS)) {
								n.setOperator(Operator.NOT_EQUALS);
							}
							if (randomBoolean() && n.getOperator().equals(Operator.GREATER)) {
								n.setOperator(Operator.LESS);
							}
							if (randomBoolean() && n.getOperator().equals(Operator.NOT_EQUALS)) {
								n.setOperator(Operator.GREATER);
							}
							if (randomBoolean() && n.getOperator().equals(Operator.LESS_EQUALS)) {
								n.setOperator(Operator.EQUALS);
							}
						}
						public void visit(StringLiteralExpr n, Object arg) {
							super.visit(n, arg);
							if (randomBoolean()){
								n.setString(StringUtils.reverse(n.getValue()));
							}
						}
						public void visit(IntegerLiteralExpr n, Object arg) {
							super.visit(n, arg);
							if(randomBoolean() && n.getValue().contains("0")) {
								n.setInt(Integer.parseInt(StringUtils.replace(n.getValue(), "0", "1")));
							}
						}
					}.visit(cu, null);
				} catch (Exception e) {
					e.printStackTrace();
				}
				saveFuzzedCode(file, cu.toString());
			} else {
				System.out.println("Skipped");
			}
		}).explore(projectDir);
	}

	private static void saveFuzzedCode(File file, String modifiedCode) {
		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(new FileWriter(file));
			writer.write(modifiedCode);
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

	private static boolean randomBoolean() {
		return new Random().nextBoolean();
	}

	private static boolean lowProbabilityBoolean() {
		return new Random().nextInt(100) > 80;
	}
}
