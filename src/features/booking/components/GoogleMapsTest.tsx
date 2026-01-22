import { useState, useEffect } from 'react';
import { Button } from '@/components/ds/button';

const GOOGLE_MAPS_API_KEY = typeof process !== 'undefined' && process.env?.REACT_APP_GOOGLE_MAPS_API_KEY 
  ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY 
  : 'AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE';

export function GoogleMapsTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    const result = `${prefix} [${timestamp}] ${message}`;
    setTestResults(prev => [...prev, result]);
    console.log(result);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Starting comprehensive Google Maps API diagnostics...');
      
      // Test 1: Environment & API Key Analysis
      const nodeEnv = typeof process !== 'undefined' && process.env?.NODE_ENV ? process.env.NODE_ENV : 'development';
      addResult(`Environment: ${nodeEnv}`);
      addResult(`Current URL: ${window.location.href}`);
      addResult(`Protocol: ${window.location.protocol} (HTTPS required for production)`);
      
      // API Key validation
      addResult(`API Key: ${GOOGLE_MAPS_API_KEY.substring(0, 25)}...`);
      addResult(`API Key Length: ${GOOGLE_MAPS_API_KEY.length} chars (should be 39)`);
      
      if (GOOGLE_MAPS_API_KEY.startsWith('AIza') && GOOGLE_MAPS_API_KEY.length === 39) {
        addResult('✅ API key format looks correct', 'success');
      } else if (GOOGLE_MAPS_API_KEY.startsWith('AIza')) {
        addResult('⚠️ API key format partially correct but unusual length', 'error');
      } else {
        addResult('❌ API key format appears invalid (should start with AIza)', 'error');
      }
      
      // Test 2: Browser & Network Analysis
      addResult(`User Agent: ${navigator.userAgent.substring(0, 50)}...`);
      addResult(`Connection: ${(navigator as any).connection?.effectiveType || 'unknown'}`);
      addResult(`Online: ${navigator.onLine ? 'Yes' : 'No'}`);
      
      // Test 3: Existing Google Maps Check
      if (window.google && window.google.maps) {
        addResult('✅ Google Maps API already loaded!', 'success');
        addResult(`Maps version: ${window.google.maps.version || 'unknown'}`);
        addResult(`Available APIs: ${Object.keys(window.google.maps).slice(0, 8).join(', ')}`, 'success');
        setIsRunning(false);
        return;
      }
      
      // Test 4: Direct API Key Validation
      addResult('🔑 Testing API key with direct validation request...');
      
      try {
        // Test with a simple geocoding request to validate the key
        const testResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=Hamburg&key=${GOOGLE_MAPS_API_KEY}`
        );
        
        if (testResponse.ok) {
          const data = await testResponse.json();
          if (data.status === 'OK') {
            addResult('✅ API key is valid and working!', 'success');
          } else if (data.status === 'REQUEST_DENIED') {
            addResult('❌ API key denied - check restrictions or enable Geocoding API', 'error');
            addResult(`Error: ${data.error_message || 'No error message'}`, 'error');
          } else {
            addResult(`⚠️ API key issue: ${data.status}`, 'error');
          }
        } else {
          addResult(`❌ API request failed: ${testResponse.status}`, 'error');
        }
      } catch (geoError) {
        addResult(`⚠️ Geocoding test failed: ${geoError}`, 'error');
      }
      
      // Test 5: Load Maps JavaScript API
      addResult('📍 Loading Maps JavaScript API...');
      
      const testUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=mapsTestCallback&libraries=places`;
      
      // Clean up any existing test callback
      delete (window as any).mapsTestCallback;
      
      // Set up test callback with timeout
      let callbackExecuted = false;
      (window as any).mapsTestCallback = () => {
        callbackExecuted = true;
        addResult('✅ Maps JavaScript API callback executed!', 'success');
        
        if (window.google && window.google.maps) {
          addResult('🗺️ Google Maps fully loaded and ready!', 'success');
          addResult(`Maps API version: ${window.google.maps.version}`, 'success');
          
          // Test map creation
          try {
            const testDiv = document.createElement('div');
            testDiv.style.width = '100px';
            testDiv.style.height = '100px';
            testDiv.style.position = 'absolute';
            testDiv.style.left = '-9999px';
            document.body.appendChild(testDiv);
            
            const testMap = new window.google.maps.Map(testDiv, {
              center: { lat: 53.5511, lng: 9.9937 },
              zoom: 10
            });
            
            if (testMap) {
              addResult('🎯 Test map creation successful!', 'success');
              document.body.removeChild(testDiv);
            }
          } catch (mapError) {
            addResult(`❌ Test map creation failed: ${mapError}`, 'error');
          }
        } else {
          addResult('❌ Callback executed but Google Maps not available', 'error');
        }
        setIsRunning(false);
      };
      
      // Create and load script
      const script = document.createElement('script');
      script.src = testUrl;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        addResult('📜 Script loaded successfully', 'success');
      };
      
      script.onerror = (error) => {
        addResult('❌ Script failed to load - likely API key issue', 'error');
        addResult('Check: API key validity, billing enabled, Maps JavaScript API enabled', 'error');
        setIsRunning(false);
      };
      
      document.head.appendChild(script);
      
      // Timeout handler
      setTimeout(() => {
        if (!callbackExecuted) {
          addResult('⏰ Timeout: API failed to load within 8 seconds', 'error');
          addResult('This usually means: Invalid API key, billing not enabled, or API not enabled', 'error');
          setIsRunning(false);
        }
      }, 8000);
      
    } catch (error) {
      addResult(`💥 Test suite failed: ${error}`, 'error');
      setIsRunning(false);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  const openGoogleCloudConsole = () => {
    window.open('https://console.cloud.google.com/google/maps-apis/credentials', '_blank');
  };

  return (
    <div className="bg-card rounded-[var(--radius-card)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3>Google Maps API Diagnostic Tool</h3>
        <div className="space-x-2">
          <Button onClick={runTests} disabled={isRunning} size="sm">
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
          <Button onClick={clearLogs} variant="outline" size="sm">
            Clear
          </Button>
          <Button onClick={openGoogleCloudConsole} variant="outline" size="sm">
            Open API Console
          </Button>
        </div>
      </div>
      
      <div className="bg-muted rounded-[var(--radius)] p-4 max-h-96 overflow-y-auto">
        <div className="font-mono text-sm space-y-1">
          {testResults.length > 0 ? (
            testResults.map((result, index) => (
              <div key={index} className={`
                ${result.includes('✅') ? 'text-green-600' : ''}
                ${result.includes('❌') ? 'text-red-600' : ''}
                ${result.includes('ℹ️') ? 'text-blue-600' : ''}
              `}>
                {result}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">Click "Run Tests" to start diagnostics...</div>
          )}
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <div className="bg-accent/10 rounded-[var(--radius)] p-4">
          <h4 className="mb-2">🔧 API Key Restrictions Guide</h4>
          <div className="space-y-2">
            <p><strong>✅ For Development (No Restrictions Needed):</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>No HTTP referrer restrictions</li>
              <li>No IP address restrictions</li>
              <li>Just ensure APIs are enabled</li>
            </ul>
            
            <p><strong>⚠️ For Production (Add Restrictions):</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>HTTP referrers: yourdomain.com/*</li>
              <li>Restrict APIs to only what you need</li>
            </ul>
          </div>
        </div>

        <div className="bg-destructive/10 rounded-[var(--radius)] p-4">
          <h4 className="mb-2">🚨 Common Issues & Solutions</h4>
          <div className="space-y-2">
            <div>
              <strong>❌ "Maps JavaScript API" not enabled:</strong>
              <p>Go to Google Cloud Console → APIs & Services → Enable APIs</p>
            </div>
            <div>
              <strong>❌ Billing not enabled:</strong>
              <p>Google requires a billing account even for free tier usage</p>
            </div>
            <div>
              <strong>❌ Request denied:</strong>
              <p>Check API key restrictions - too restrictive for current domain</p>
            </div>
            <div>
              <strong>❌ Invalid API key format:</strong>
              <p>Should be 39 characters starting with "AIza"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}