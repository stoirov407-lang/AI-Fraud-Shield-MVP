package com.fraudshield

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {
    private val smsPermission = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var protection by remember { mutableStateOf(false) }
            val smsGranted = ContextCompat.checkSelfPermission(
                this, Manifest.permission.RECEIVE_SMS
            ) == PackageManager.PERMISSION_GRANTED

            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    Column(
                        modifier = Modifier.padding(24.dp).fillMaxSize(),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("Fraud Shield", style = MaterialTheme.typography.headlineLarge)
                        Spacer(Modifier.height(8.dp))
                        Text("Automatic fraud protection", style = MaterialTheme.typography.titleMedium)
                        Spacer(Modifier.height(28.dp))
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(Modifier.padding(20.dp)) {
                                Text(if (protection) "Protection ON" else "Protection OFF", style = MaterialTheme.typography.headlineSmall)
                                Spacer(Modifier.height(8.dp))
                                Text(if (smsGranted) "SMS protection permission is enabled." else "Allow SMS access to automatically check incoming SMS.")
                                Spacer(Modifier.height(16.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Switch(checked = protection, onCheckedChange = { enabled ->
                                        if (enabled && !smsGranted) {
                                            smsPermission.launch(Manifest.permission.RECEIVE_SMS)
                                        }
                                        protection = enabled
                                    })
                                    Spacer(Modifier.width(12.dp))
                                    Text("Automatic protection")
                                }
                            }
                        }
                        Spacer(Modifier.height(16.dp))
                        OutlinedButton(onClick = {
                            startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
                        }) {
                            Text("Connect notification protection")
                        }
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Your device checks supported content automatically. You stay in control of permissions.",
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
            }
        }
    }
}
