import { Platform } from 'react-native';
import { router } from 'expo-router';

/**
 * Utility to clean up the __EXPO_ROUTER_key parameter from URLs
 * This is a temporary fix for an Expo Router bug
 */
export const cleanupExpoRouterKey = () => {
  if ( Platform.OS === 'web' ) {
    // Use setTimeout to ensure this runs after all other JS in the event loop
    setTimeout( () => {
      if ( window.location.href.includes( '__EXPO_ROUTER_key=' ) ) {
        const url = new URL( window.location.href );
        url.searchParams.delete( '__EXPO_ROUTER_key' );
        
        // Replace the current URL without causing a page reload
        window.history.replaceState( {}, document.title, url.toString() );
        
        console.log( 'Cleaned up URL:', url.toString() );
      }
    }, 0 );
  }
};

/**
 * Sets up all URL cleaning mechanisms for the application
 * Call this once at the application root level
 */
export const setupUrlCleaner = () => {
  if ( Platform.OS !== 'web' || typeof window === 'undefined' ) {
    return { cleanup: () => {} };
  }
  
  // Monkey patch router methods to clean URL after each navigation
  const originalPush = router.push;
  const originalReplace = router.replace;
  
  router.push = ( ...args ) => {
    const result = originalPush( ...args );
    cleanupExpoRouterKey();
    return result;
  };
  
  router.replace = ( ...args ) => {
    const result = originalReplace( ...args );
    cleanupExpoRouterKey();
    return result;
  };
  
  // Add event listeners for URL changes
  window.addEventListener( 'popstate', cleanupExpoRouterKey );
  window.addEventListener( 'hashchange', cleanupExpoRouterKey );
  
  // Set up MutationObserver to detect DOM changes that might indicate navigation
  let observer: MutationObserver | null = null;
  
  if ( typeof MutationObserver !== 'undefined' ) {
    observer = new MutationObserver( () => {
      if ( window.location.href.includes( '__EXPO_ROUTER_key=' ) ) {
        cleanupExpoRouterKey();
      }
    } );
    
    observer.observe( document.body, {
      childList: true,
      subtree: true,
    } );
  }
  
  // Return cleanup function to remove event listeners and disconnect observer
  return {
    cleanup: () => {
      window.removeEventListener( 'popstate', cleanupExpoRouterKey );
      window.removeEventListener( 'hashchange', cleanupExpoRouterKey );
      if ( observer ) {
        observer.disconnect();
      }
      
      // Restore original router methods
      router.push = originalPush;
      router.replace = originalReplace;
    },
  };
};