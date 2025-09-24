@@ .. @@
   // Transform API data to chart format and round to 1 decimal place
   const data = useMemo(() => {
     if (chartData?.chartData) {
       return chartData.chartData.map((point) => ({
         time: new Date(point.timestamp).toLocaleTimeString(),
-        gvf: point.gvf != null ? round1(point.gvf) : 0,
-        wlr: point.wlr != null ? round1(point.wlr) : 0,
+        gvf: point.gvf != null ? round1(parseFloat(point.gvf.toString())) : 0,
+        wlr: point.wlr != null ? round1(parseFloat(point.wlr.toString())) : 0,
       }));
     } else if (hierarchyChartData?.chartData) {
       return hierarchyChartData.chartData.map((point) => ({
         time: new Date(point.timestamp).toLocaleTimeString(),
-        gvf: point.totalGvf != null ? round1(point.totalGvf) : 0,
-        wlr: point.totalWlr != null ? round1(point.totalWlr) : 0,
+        gvf: point.totalGvf != null ? round1(parseFloat(point.totalGvf.toString())) : 0,
+        wlr: point.totalWlr != null ? round1(parseFloat(point.totalWlr.toString())) : 0,
       }));
     }
     
-    // Default data if no API data - matching the image pattern
+    // Default data if no API data - for testing
     return [
-      { time: '14:25:48', gvf: round1(12000), wlr: round1(12500) },
-      { time: '14:25:50', gvf: round1(9000), wlr: round1(9500) },
-      { time: '14:25:52', gvf: round1(7500), wlr: round1(8000) },
-      { time: '14:25:54', gvf: round1(6000), wlr: round1(6500) },
+      { time: '14:25:48', gvf: round1(65), wlr: round1(85) },
+      { time: '14:25:50', gvf: round1(62), wlr: round1(82) },
+      { time: '14:25:52', gvf: round1(68), wlr: round1(88) },
+      { time: '14:25:54', gvf: round1(70), wlr: round1(90) },
     ];
   }, [chartData, hierarchyChartData]);