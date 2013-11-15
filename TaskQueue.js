/**
 * TaskQueue.js
 * Author: nemasu@gmail.com
 * Description: Object that runs tasks without freezing browser.
 * 
 * Usage:
 * Push a function, if it returns true, it will pop off the queue,
 * if it returns false, it will retry.
 * 
 * Eg:
 * q = new TaskQueue( 200 );
 * q.push( function() {
 *     if( console != undefined ) {
 *         console.log('Hiii');
 *         return true;
 *     }
 *     return false;
 * });
 */
function TaskQueue( frequency ) {
    this.queue = [];
    this.interval_id = 0;
    this.current = null;
    this.frequency = frequency;
}
TaskQueue.prototype.pop = function() {
    //Check if document is loaded, if not return
    if( document.readyState != 'complete' ) {
        return;
    }
    
    //Check if there's anything to do, if not disable interval.
    if( !this.current ) {
        if( !this.queue.length ) {
            window.clearInterval( this.interval_id );
            this.interval_id = 0;
            return;
        }
        this.current = this.queue.shift();
    }
    if( this.current() ) {
        this.current = null;
    }
}
TaskQueue.prototype.push = function( task ) {
    var self = this;
    this.queue.push( task );
    //Check if queue is being processed, if it isn't then start it.
    if( !this.interval_id ) {
        this.interval_id = window.setInterval( function() {
            self.pop();
        }, this.frequency );
    }
}
TaskQueue.prototype.pause = function( ms ) {
    var self = this;
    window.clearInterval( this.interval_id );
    this.interval_id = 0;
    
    var cont = function() {
        self.interval_id = window.setInterval( function() {
            self.pop();
        }, self.frequency );
    }
    window.setTimeout( cont, ms );
}
