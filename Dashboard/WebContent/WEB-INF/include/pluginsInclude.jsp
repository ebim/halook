<%@page import="java.io.FileReader"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="java.io.BufferedReader"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>

<%@ page import="java.io.File"%>
<%@ page import="java.lang.String"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.List"%>
<%@ page import="org.wgp.file.filter.FileNameFilter"%>
<%@ page import="org.wgp.file.util.FilePathUtil"%>

<%
	// プラグイン単位のディレクトリ名を取得する
	String pluginsDirectoryPath = config.getServletContext().getRealPath("resources/plugins");
	File pluginsDirectory = new File(pluginsDirectoryPath);
	String[] pluginNames = pluginsDirectory.list();
	
	/*
	 * 各プラグインディレクトリ直下にあるconfig.txtファイルからインポートするjsファイル/cssファイルを取得し、
	 * jsファイル/cssファイルそれぞれに対してインポートタグを生成する。
	 */
	for (String pluginName: pluginNames) {
		File elementDirectory = new File(pluginsDirectory, pluginName);
		File configFile = new File(elementDirectory, "include.txt");
		// ファイルが存在しない場合はそのプラグインのファイルインポートはしない
		boolean isExist = configFile.exists();
		if (!isExist) {
			System.out.println(elementDirectory + "\\include.txtが存在しないため、このプラグインファイルの読込はできませんでした。");
			continue;
		}
		
		BufferedReader reader = new BufferedReader(new FileReader(configFile));
		String line;
		
		while ((line = reader.readLine()) != null) {
			String tmpfilePath = "/resources/plugins/" + pluginName + "/" + line;
			String filePath = tmpfilePath.replaceAll("\\\\", "/");
			if (line.endsWith("js")) {
				out.print("<script type=\"text/javascript\" ");
				out.print("src=\"" + request.getContextPath()
						+ filePath
						+ "\">");
				out.println("</script>");
			}
			else if (line.endsWith("css")) {
				out.print("<link rel=\"stylesheet\" ");
				out.print("href=\"" + request.getContextPath()
						+ filePath
						+ "\" ");
				out.print("type=\"text/css\" ");
				out.print("media=\"all\">");
			}
		}
		reader.close();
	}

%>
</body>
</html>