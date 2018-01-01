package com.cmpe451.interesthub.fragments;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ListView;

import com.cmpe451.interesthub.InterestHub;
import com.cmpe451.interesthub.R;
import com.cmpe451.interesthub.activities.ProfileActivity;
import com.cmpe451.interesthub.activities.UserActivity;
import com.cmpe451.interesthub.adapters.UserAdapter;
import com.cmpe451.interesthub.adapters.UserCardListAdapter;
import com.cmpe451.interesthub.adapters.UserFollowRequestCardListAdapter;
import com.cmpe451.interesthub.models.FollowersList;
import com.cmpe451.interesthub.models.Following_Followers;
import com.cmpe451.interesthub.models.User;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


/**
 * Created by mmervecerit on 22.11.2017.
 */

public class User_Followers_Fragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    List<User> userList;
    List<User> requestList;
    private Handler mHandler;
    InterestHub hub;
    RecyclerView list;
    Button requestbutton;
    private OnFragmentInteractionListener mListener;
    private long userid;
    public User_Followers_Fragment(long userid) {
        this.userid = userid;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        //return inflater.inflate(R.layout.fragment_user_following, container, false);
        View  view =inflater.inflate(R.layout.fragment_user_followers, container, false);
        list = view.findViewById(R.id.userFollowersList);
        userList  = new ArrayList<User>();
        requestbutton = view.findViewById(R.id.followrequestbutton);
        requestbutton.setVisibility(View.GONE);
        hub = (InterestHub) getActivity().getApplication();
        mHandler = new Handler();
        startRepeatingTask();

        return view;
    }
    public void refresh(long userid){
        if (userid==0) {

            hub.getApiService().getFollowers().enqueue(new Callback<FollowersList>() {
                @Override
                public void onResponse(Call<FollowersList> call, Response<FollowersList> response) {
                    if (response != null && response.body() != null) {
                        userList = response.body().getFollowers();
                        setAdapter();
                        requestList = response.body().getRequests();

                        setRequestAdapter();
                    }
                }

                @Override
                public void onFailure(Call<FollowersList> call, Throwable t) {

                }
            });
        }
        else{
            hub.getApiService().getFollowersOfSomeone(userid).enqueue(new Callback<List<User>>() {
                @Override
                public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                    if (response != null && response.body() != null)
                        userList = response.body();
                    setAdapter();
                }

                @Override
                public void onFailure(Call<List<User>> call, Throwable t) {

                }
            });

        }

    }
    public void setAdapter(){
        final LinearLayoutManager ll = new LinearLayoutManager( getActivity());
        ll.setOrientation(LinearLayoutManager.VERTICAL);

        list.setLayoutManager(ll);
        UserCardListAdapter.OnItemClickListener listener = new UserCardListAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(int pos) {
                Intent intent = new Intent(getContext(), ProfileActivity.class);
                intent.putExtra("userId", userList.get(pos).getId());
                startActivity(intent);


            }
        };
        final UserCardListAdapter adapter = new UserCardListAdapter(getContext(), userList, listener);
        list.setAdapter(adapter);
        adapter.notifyDataSetChanged();
    }
    public void setRequestAdapter(){

        Log.d("REQUESTS", String.valueOf(requestList.size()));
        if(requestList.size()>0){
            requestbutton.setText("Follow Requests ("+requestList.size()+")");
            requestbutton.setVisibility(View.VISIBLE);
            requestbutton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    final AlertDialog.Builder alertDialog = new AlertDialog.Builder(getContext());
                    LayoutInflater inflater = getLayoutInflater();
                    View convertView = (View) inflater.inflate(R.layout.alert_recycler, null);
                    alertDialog.setView(convertView);
                    alertDialog.setTitle("Follow Requests");
                    alertDialog.setPositiveButton("OK",new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.dismiss();
                        }
                    });
                    final LinearLayoutManager ll = new LinearLayoutManager( getActivity());
                    ll.setOrientation(LinearLayoutManager.VERTICAL);

                    RecyclerView lv = (RecyclerView) convertView.findViewById(R.id.alertRecycler);
                    lv.setLayoutManager(ll);
                    UserFollowRequestCardListAdapter.OnItemClickListener approveListener = new UserFollowRequestCardListAdapter.OnItemClickListener() {
                        @Override
                        public void onItemClick(final int pos) {
                            if(pos<requestList.size()) {
                                JsonObject innerObject = new JsonObject();
                                innerObject.addProperty("id", requestList.get(pos).getId());
                                Gson gson = new Gson();
                                String json = gson.toJson(innerObject);
                                Log.d("JSON", json);
                                RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
                                hub.getApiService().approveFollowRequest(requestBody).enqueue(new Callback<User>() {
                                    @Override
                                    public void onResponse(Call<User> call, Response<User> response) {

                                        refresh(userid);

                                    }

                                    @Override
                                    public void onFailure(Call<User> call, Throwable t) {

                                    }
                                });
                            }

                        }
                    };
                    UserFollowRequestCardListAdapter.OnItemClickListener cancelListener = new UserFollowRequestCardListAdapter.OnItemClickListener() {
                        @Override
                        public void onItemClick(int pos) {
                            if(pos<requestList.size()) {
                                JsonObject innerObject = new JsonObject();
                                innerObject.addProperty("id", requestList.get(pos).getId());
                                Gson gson = new Gson();
                                String json = gson.toJson(innerObject);
                                Log.d("JSON", json);
                                RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
                                hub.getApiService().deleteFollowRequest(requestBody).enqueue(new Callback<User>() {
                                    @Override
                                    public void onResponse(Call<User> call, Response<User> response) {

                                        refresh(userid);

                                    }

                                    @Override
                                    public void onFailure(Call<User> call, Throwable t) {

                                    }
                                });
                            }

                        }
                    };
                    final UserFollowRequestCardListAdapter adapter = new UserFollowRequestCardListAdapter(getContext(), requestList,approveListener,cancelListener);
                    lv.setAdapter(adapter);

                    alertDialog.show();
                }
            });


        }else{

        }






    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
    void startRepeatingTask() {
        mStatusChecker.run();
    }

    void stopRepeatingTask() {
        mHandler.removeCallbacks(mStatusChecker);
    }
    Runnable mStatusChecker = new Runnable() {
        @Override
        public void run() {
            try {
                refresh(userid);
            } finally {

                mHandler.postDelayed(mStatusChecker, 5000);
            }
        }
    };
}

