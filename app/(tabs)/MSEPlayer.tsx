import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

interface MSEPlayerProps {
  uri: string;
  isLiveStream?: boolean;
}

export const MSEPlayer: React.FC<MSEPlayerProps> = ({ uri, isLiveStream = true }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <style>
          body { margin: 0; background-color: #000; }
          #video {
            width: 100%;
            height: 100%;
            background: #000;
          }
        </style>
      </head>
      <body>
        <video id="video"></video>
        <script>
          const video = document.getElementById('video');
          const isLiveStream = ${isLiveStream};

          function initPlayer() {
            if (Hls.isSupported()) {
              const hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: isLiveStream,
                backBufferLength: isLiveStream ? 30 : 60,
                maxBufferSize: 10 * 1000 * 1000,
                maxBufferLength: isLiveStream ? 5 : 30,
                maxMaxBufferLength: isLiveStream ? 10 : 60,
                startLevel: -1,
              });

              hls.loadSource('${uri}');
              hls.attachMedia(video);
              
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(console.error);
              });
            }
            // For browsers that have native HLS support
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
              video.src = '${uri}';
              video.addEventListener('loadedmetadata', () => {
                video.play().catch(console.error);
              });
            }
          }

          document.addEventListener('DOMContentLoaded', initPlayer);
        </script>
      </body>
    </html>
  `;

  // For web platform, render native video element
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <video
                id="video"
                style="width: 100%; height: 100%;"
                playsinline
                muted
              />
            `,
          }}
          style={{
            width: width,
            height: width * (9 / 16),
          }}
          ref={(el) => {
            if (el && !el.querySelector("script")) {
              const script = document.createElement("script");
              script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
              script.async = true;
              script.onload = () => {
                const video = el.querySelector("video");
                if (video) {
                  const hls = new (window as any).Hls();
                  hls.loadSource(uri);
                  hls.attachMedia(video);
                  hls.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(console.error);
                  });
                }
              };
              el.appendChild(script);
            }
          }}
        />
      </View>
    );
  }

  // For mobile platforms, use WebView
  return (
    <View style={styles.container}>
      <WebView
        style={styles.video}
        source={{ html: htmlContent }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width,
    height: width * (9 / 16),
  },
});
