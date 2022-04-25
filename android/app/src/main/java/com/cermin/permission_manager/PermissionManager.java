package com.cermin.permission_manager;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.OutputStream;

public class PermissionManager extends ReactContextBaseJavaModule
{
    public PermissionManager(ReactApplicationContext reactContext){
        super(reactContext);
    }

    @Override
    public String getName(){
        return "PermissionManager";
    }

    private Boolean checkPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            return Environment.isExternalStorageManager();
        } else {
            return true;
        }
    }

    Context context = getReactApplicationContext();

    @ReactMethod
    public void requestAllStoragePermission(Promise promise) {
        Boolean isGranted = checkPermission();
        if (isGranted) {
            promise.resolve("Permission Already Granted");
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                try {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, Uri.parse("package:" + getReactApplicationContext().getPackageName()));
//                    intent.setAction(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                    getCurrentActivity().startActivity(intent);
                    promise.resolve("Permission Asked");
                } catch (Exception e) {
                    promise.reject(e);
                }
            } else {
                promise.resolve("Not Android 11");
            }
        }
    }

    @ReactMethod
    public void LockTimezone (Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                Settings.Global.putInt(context.getContentResolver(), Settings.Global.AUTO_TIME, 1);
            } else {
                Settings.System.putInt(context.getContentResolver(), Settings.Global.AUTO_TIME, 1);
            }
            promise.resolve("Timezone Locked");
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void checkTimezoneSetting (Promise promise) {
        try {
            Boolean res = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                res = Settings.Global.getInt(context.getContentResolver(), Settings.Global.AUTO_TIME, 0) == 1;
            } else {
                res = Settings.System.getInt(context.getContentResolver(), Settings.Global.AUTO_TIME, 0) == 1;
            }
            promise.resolve(res);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    private Uri getFileUri(String filepath, boolean isDirectoryAllowed) throws IORejectionException {
        Uri uri = Uri.parse(filepath);
        if (uri.getScheme() == null) {
            // No prefix, assuming that provided path is absolute path to file
            File file = new File(filepath);
            if (!isDirectoryAllowed && file.isDirectory()) {
                    throw new IORejectionException("EISDIR", "EISDIR: illegal operation on a directory, read '" + filepath + "'");
            }
            uri = Uri.parse("file://" + filepath);
        }
        return uri;
    }

    private OutputStream getOutputStream(String filepath, boolean append) throws IORejectionException {
        Uri uri = getFileUri(filepath, false);
        OutputStream stream;
        try {
            stream = context.getContentResolver().openOutputStream(uri, append ? "wa" : "w");
        } catch (FileNotFoundException ex) {
            throw new IORejectionException("ENOENT", "ENOENT: " + ex.getMessage() + ", open '" + filepath + "'");
        }
        if (stream == null) {
            throw new IORejectionException("ENOENT", "ENOENT: could not open an output stream for '" + filepath + "'");
        }
        return stream;
    }

    @ReactMethod
    public void writeFile (String path, String content, Promise promise) {
        try {
            byte[] bytes = content.getBytes();
            OutputStream outputStream = getOutputStream(path, false);
            outputStream.write(bytes);
            outputStream.close();

            promise.resolve("Write Success");
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}
